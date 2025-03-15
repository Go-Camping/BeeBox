/**
 * 能够生长的树module
 * 
 * TODO: 实现树枝分叉功能，实现果实生长功能，实现养分功能
 * @param {Internal.Level} level 
 * @param {BlockPos} rootPos 
 */
function GrowthTree(level, rootPos, treeType) {
    this.level = level
    this.rootPos = rootPos
    this.nutrientBlock = "minecraft:honey_block"
    this.nutrientAmount = 0
    this.limbBlock = "kubejs:zenith_clouds_log"
    /**
     * @type {BlockPos[]}
     */
    this.limbPos = []
    /**
     * @type {BlockPos[]}
     */
    this.fruitPos = []
    this.fruitState = 0
    this.fruitBlock = "minecraft:red_mushroom_block"
    this.fruitAge = 0
    this.fruitMaxAge = 100
    /**
     * @type {BlockPos[]}
     */
    this.budPos = []
    this.maxBranch = 5
    this.treeAge = 0
    this.treeType = treeType ?? "kubejs:free_log"
}
GrowthTree.prototype = {
    /**
     * 进行一次生长，包括分支生长，芽生长，果实生长(目前仅实现芽生长)
     * 
     * 在此之前先用checkTree检查树的完整性
     * @returns 
     */
    growth : function() {
        if(this.treeAge == 0){
            this.budPos.push(this.rootPos.offset(0, 1, 0))
        }
        // TODO: 实现树枝分叉功能、果实生长功能
        this.budGrowToLimb()
        this.budFindNext()
        this.treeAge++
        this.saveDataToRoot()
        return
    },
    /**
     * 检查树的完整性
     * @returns {boolean}
     */
    checkTree : function() {
        let treeIntegrity = true
        this.limbPos.forEach(pos => {
            if(this.level.getBlock(pos).id != this.limbBlock){
                treeIntegrity = false
            }
        })
        return treeIntegrity
    },
    /**
     * 寻找芽的下一个可生成位置,没有可生成位置则返回芽的当前位置
     * @returns {BlockPos[]}
     */
    budFindNext : function() {
        let result = []
        for(let i = 0; i < this.budPos.length; i++){
            let centerPos = this.budPos[i]
            let nextPos = randomInList(this.getAroundVaildPos(centerPos, (aroundPos) => {
                let aroundBlock = this.level.getBlock(aroundPos)
                let flag1 = aroundBlock.y >= centerPos.y
                let flag2 = aroundBlock.getId() == "minecraft:air"
                let flag3 = aroundBlock.offset(0, -1, 0).getId() != this.limbBlock || PosEqual(aroundBlock.pos.offset(0, -1, 0), centerPos)
                return flag1 && flag2 && flag3
            }))
            if(nextPos){
                result.push(nextPos)
            }else{
                result.push(centerPos)
            }
        }
        this.budPos = result
        return this
    },
    /**
     * 
     * @param {BlockPos} pos 
     * @param {function(BlockPos):boolean} isVaild 
     */
    getAroundVaildPos: function (startPos, isVaild){
        let result = []
        let pos = []
        pos[0] = startPos.offset(1, 0, 0)
        pos[1] = startPos.offset(-1, 0, 0)
        pos[2] = startPos.offset(0, 0, 1)
        pos[3] = startPos.offset(0, 0, -1)
        pos[4] = startPos.offset(0, 1, 0)
        pos[5] = startPos.offset(0, -1, 0)
        pos.forEach(pos => {
            if(isVaild(pos)){
                result.push(pos)
            }
        })
        return result
    },
    budGrowToLimb : function(){
        this.budPos.forEach(pos => {
            this.level.getBlock(pos).set(this.limbBlock)
            this.limbPos.push(pos)
            // this.level.tell("生成树枝")
            this.saveDataToLimb(pos)
        })
        return this
    },
    saveDataToRoot : function(){
        let rootBlock = this.level.getBlock(this.rootPos)
        let entityData = rootBlock.getEntityData()
        entityData.getCompound("data").put("TreeData", NBT.compoundTag())
        let treeData = entityData.getCompound("data").getCompound("TreeData")
        treeData.putString("TreeType", this.treeType)
        treeData.putInt("treeAge", this.treeAge)
        treeData.put("budPos", NBT.listTag())
        this.budPos.forEach(pos => {
            treeData.get("budPos").push(Pos2NBT(pos))
        })
        treeData.put("fruitPos", NBT.listTag())
        this.fruitPos.forEach(pos => {
            treeData.get("fruitPos").push(Pos2NBT(pos))
        })
        treeData.put("limbPos", NBT.listTag())
        this.limbPos.forEach(pos => {
            treeData.get("limbPos").push(Pos2NBT(pos))
        })
        rootBlock.mergeEntityData(entityData)
        return this
    },
    loadDataFromRoot : function(){
        let GTree = new GrowthTree(this.level, this.rootPos)
        let rootBlock = this.level.getBlock(this.rootPos)
        let entityData = rootBlock.getEntityData()
        let treeData = entityData.getCompound("data").getCompound("TreeData")
        GTree.treeType = treeData.getString("TreeType")
        GTree.treeAge = treeData.getInt("treeAge")
        /**
         * @type {Internal.CompoundTag[]}
         */
        let budPosList = treeData.get("budPos") ?? []
        budPosList.forEach(tag => {
            GTree.budPos.push(NBT2Pos(tag))
        })
        /**
         * @type {Internal.CompoundTag[]}
         */
        let fruitPosList = treeData.get("fruitPos") ?? []
        fruitPosList.forEach(tag => {
            GTree.fruitPos.push(NBT2Pos(tag))
        })
        /**
         * @type {Internal.CompoundTag[]}
         */
        let limbPosList = treeData.get("limbPos") ?? []
        limbPosList.forEach(tag => {
            GTree.limbPos.push(NBT2Pos(tag))
        })
        return GTree
    },
    /**
     * 
     * @param {BlockPos} pos limb坐标 
     * @returns 
     */
    saveDataToLimb : function(pos){
        let limbBlock = this.level.getBlock(pos)
        let entityData = limbBlock.getEntityData()
        entityData.getCompound("data").put("RootData", Pos2NBT(this.rootPos))
        // TODO: 保存所在分枝信息
        entityData.getCompound("data").putInt("Branch", 0)
        limbBlock.mergeEntityData(entityData)
        return this
    },
    /**
     * 
     * @param {BlockPos} pos limb坐标
     */
    loadDataFromLimb : function(pos){
        let GTree = new GrowthTree(this.level, this.rootPos)
        let limbBlock = this.level.getBlock(pos)
        let entityData = limbBlock.getEntityData()
        let rootData = entityData.getCompound("data").getCompound("RootData")
        GTree.rootPos = NBT2Pos(rootData)
        // TODO: 加载所在分枝信息
        let Branch = entityData.getCompound("data").getInt("Branch")
        return GTree
    },
}
