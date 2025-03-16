/**
 * 能够生长的树module
 * 
 * TODO: 实现养分功能
 * @param {Internal.Level} level 
 * @param {BlockPos} rootPos 
 * @param {string?} treeType 树的类型 TODO: 实现树的类型选择,根据类型执行对应的生长函数
 */
function GrowthTree(level, rootPos, treeType) {
    this.level = level
    this.rootPos = rootPos
    this.nutrientBlock = "minecraft:honey_block"
    this.nutrientAmount = 0
    this.leaveBlock = 'minecraft:sculk'
    /**
     * 树干方块
     */
    this.limbBlock = "kubejs:zenith_clouds_log"
    /**
     * @type {BlockPos[]} 树干的坐标
     */
    this.limbPos = []
    /**
     * @type {BlockPos[]} 果实的坐标
     */
    this.fruitPos = []
    this.fruitState = 0
    this.fruitBlock = "kubejs:zenith_clouds_fruit"
    /**
     * 开始生长果实的树龄
     */
    this.fruitGrowTreeAge = 20
    // this.fruitMaxAge = 100
    /**
     * @type {BlockPos[]} 芽的坐标
     */
    this.budPos = []
    /**
     * 最大分支数
     */
    this.maxBranch = 5
    /**
     * 当前树龄
     */
    this.treeAge = 0
    /**
     * 最大树龄
     */
    this.maxTreeAge = 25
    /**
     * 树的类型
     */
    this.treeType = treeType ?? "kubejs:free_log"
}
GrowthTree.prototype = {
    /**
     * 进行a次生长，包括分支生长，芽生长，果实生长
     * 
     * @param {number} a 生长次数
     * @returns 
     */
    growUp(a) {
        a = a ?? 1
        for(let i = 0; i < a; i++){
            if(!this.checkTree()){return}
            if(!this.checkRoot()){return}
            this.growBud()
            this.growLimb()
            this.growFruit()
            this.updataTreeAge()
            this.saveDataToRoot()
        }
        return
    },
    /**
     * 树的最大生长次数
     * @param {number} maxTreeAge 
     * @returns 
     */
    setMaxTreeAge(maxTreeAge){
        this.maxTreeAge = maxTreeAge
        return this
    },
    /**
     * 检查是否能够生长
     */
    checkRoot(){
        let rootBlock = this.level.getBlock(this.rootPos)
        let vaildBlockList = this.findAroundVaildPos(this.rootPos, (aroundPos) => {
            let aroundBlock = this.level.getBlock(aroundPos)
            if(PosEqual(aroundBlock.getDown().pos, rootBlock.pos)){
                return true
            }
            let flag1 = aroundBlock.hasTag('minecraft:dirt')
            return flag1
        })
        if(vaildBlockList.length >= 6){
            return true
        }
        return false
    },
    /**
     * 
     * @returns {boolean}
     */
    checkTree() {
        // 检查年龄
        if(this.treeAge >= this.maxTreeAge){
            this.level.getBlock(this.rootPos).set(this.limbBlock)
            return false
        }
        // 检查树的完整性
        this.limbPos.forEach(pos => {
            let block = this.level.getBlock(pos)
            if(block.id != this.limbBlock && block.id != this.fruitBlock){
                this.level.tell(block.id)
                this.level.getBlock(this.rootPos).set(this.limbBlock)
                return false
            }
        })
        return true
    },
    /**
     * 检查是否达到生长上限，达到后进行一次终局生长
     */
    growFruit() {
        let flag1 = this.treeAge == this.maxTreeAge - 1
        if(flag1){
            this.budPos.forEach(bud => {
                this.level.getBlock(bud).set(this.fruitBlock)
                this.growLeave(bud)
            })
            this.budPos = []
        }
        for(let i = 0; i < this.budPos.length; i++){
            let bud = this.budPos[i]
            let startGrowFruitAge = Math.random() * this.maxTreeAge
            if(startGrowFruitAge < this.treeAge && this.fruitGrowTreeAge <= this.treeAge){
                this.level.getBlock(bud).set(this.fruitBlock)
                this.growLeave(bud)
                this.budPos.splice(i, 1)
            }
        }
        return this
    },
    /**
     * 芽的分裂行为
     * @returns 
     */
    growBud(){
        if(this.budPos.length < this.maxBranch){
            // 树龄到某值才能分类
            let flag1 = this.treeAge > 5
            // 树龄到某值必定分裂一次
            let flag2 = this.treeAge == 5
            if((Math.random() < 0.05 && flag1) || flag2){
                this.budPos.push(randomInList(this.budPos))
            }
        }
        return this
    },
    /**
     * 寻找芽的下一个可生成位置,没有可生成位置则保持芽的当前位置，随后生长。本函数决定树的生长形态
     */
    growLimb() {
        if(this.treeAge == 0){
            this.budPos = [this.rootPos.offset(0, 1, 0)]
            this.placeLimbBlock(this.budPos[0])
            return this
        }
        let result = []
        for(let i = 0; i < this.budPos.length; i++){
            let currentBudPos = this.budPos[i]
            let nextBudPos = randomInList(this.findAroundVaildPos(currentBudPos, (aroundPos) => {
                let aroundBlock = this.level.getBlock(aroundPos)
                // 禁止向下生长
                let flag1 = aroundBlock.y >= currentBudPos.y
                // 只能往空气或自己的树叶里长
                let flag2 = aroundBlock.getId() == "minecraft:air" || aroundBlock.getId() == this.leaveBlock
                // 向水平四周生长时下方不能为limb
                let flag3 = aroundBlock.offset(0, -1, 0).getId() != this.limbBlock || PosEqual(aroundBlock.pos.offset(0, -1, 0), currentBudPos)
                // 树龄到达某值之前只能向上生长
                let flag4 = this.treeAge >= 5 || PosEqual(aroundBlock.pos.offset(0, -1, 0), currentBudPos)
                return flag1 && flag2 && flag3 && flag4
            }))
            if(nextBudPos){
                result.push(nextBudPos)
                this.placeLimbBlock(currentBudPos, nextBudPos).placeLimbBlock(nextBudPos)
                if(Math.random() < 0.2 && this.treeAge > 5){
                    this.growLeave(nextBudPos)
                }
            }else{
                result.push(currentBudPos)
            }
        }
        this.budPos = result
        return this
    },
    updataTreeAge(){
        this.treeAge = this.treeAge >= this.maxTreeAge ? this.maxTreeAge : this.treeAge + 1
        return this
    },
    /**
     * 
     * @param {BlockPos} pos 
     * @returns 
     */
    growLeave(pos){
        let xLength = 3
        let yLength = 2
        let zLength = 3
        let rangSqr = 5 
        for(let x = 0; x < xLength; x = x > 0 ? - x : 1 - x){
            for(let z = 0; z < zLength; z = z > 0 ? - z : 1 - z){
                for(let y = 0; y < yLength; y = y > 0 ? - y : 1 - y){
                    let block = this.level.getBlock(pos).offset(x, y, z)//
                    let distSqr = block.pos.distSqr(pos)
                    if(distSqr > rangSqr) {
                        // this.level.tell(distSqr)
                        continue
                    }
                    if(block.id == "minecraft:air"){
                        block.set(this.leaveBlock)
                    }
                }
            }
        }
        return this
    },
    /**
     * 放置目标limb并记录目标limb的子节点坐标；如果sonLimbPos为空则默认为targetLimbPos
     * 
     * @param {BlockPos} targetLimbPos 
     * @param {BlockPos?} sonLimbPos 
     * @returns 
     */
    placeLimbBlock(targetLimbPos, sonLimbPos){
        sonLimbPos = sonLimbPos ?? targetLimbPos
        this.level.getBlock(targetLimbPos).set(this.limbBlock)
        this.limbPos.push(targetLimbPos)
        let leaveStatus = randomInList([0, 0, 0, 0, 1])
        this.putDataToLimb(targetLimbPos, sonLimbPos, leaveStatus)
        return this
    },
    /**
     * 
     * @param {BlockPos} budPos 
     * @param {function(BlockPos):boolean} isVaild 
     * @returns {BlockPos[]}
     */
    findAroundVaildPos(budPos, isVaild){
        let result = []
        let pos = []
        pos[0] = budPos.offset(1, 0, 0)
        pos[1] = budPos.offset(-1, 0, 0)
        pos[2] = budPos.offset(0, 0, 1)
        pos[3] = budPos.offset(0, 0, -1)
        pos[4] = budPos.offset(0, 1, 0)
        pos[5] = budPos.offset(0, -1, 0)
        pos.forEach(pos => {
            if(isVaild(pos)){
                result.push(pos)
            }
        })
        return result
    },
    saveDataToRoot(){
        let rootBlock = this.level.getBlock(this.rootPos)
        let entityData = rootBlock.getEntityData()
        entityData.getCompound("data").put("TreeData", NBT.compoundTag())
        let treeData = entityData.getCompound("data").getCompound("TreeData")
        treeData.putString("treeType", this.treeType)
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
    loadDataFromRoot(){
        let GTree = new GrowthTree(this.level, this.rootPos)
        let rootBlock = this.level.getBlock(this.rootPos)
        let entityData = rootBlock.getEntityData()
        let treeData = entityData.getCompound("data").getCompound("TreeData")
        GTree.treeType = treeData.getString("treeType")
        this.level.tell(treeData.getString("treeType"))
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
     * @param {BlockPos} pos 目标limb坐标 
     * @param {BlockPos} SonLimbPos 目标limb的下个节点的坐标
     * @returns 
     */
    putDataToLimb(pos, SonLimbPos, leaveStatus){
        leaveStatus = leaveStatus ?? 0
        let limbBlock = this.level.getBlock(pos)
        let entityData = limbBlock.getEntityData()
        entityData.getCompound("data").put("RootPos", Pos2NBT(this.rootPos))
        // TODO: 保存所在分枝信息
        entityData.getCompound("data").put("SonLimbPos", Pos2NBT(SonLimbPos))
        // entityData.getCompound("data").putByte("LeaveStatus", leaveStatus)
        limbBlock.mergeEntityData(entityData)
        return this
    },
    /**
     * 
     * @param {BlockPos} pos 目标limb坐标
     */
    getDataFromLimb(pos){
        let limbBlock = this.level.getBlock(pos)
        let entityData = limbBlock.getEntityData()
        let rootPos = entityData.getCompound("data").getCompound("RootPos")
        let sonLimbPos = entityData.getCompound("data").getCompound("SonLimbPos")
        // let leaveStatus = entityData.getCompound("data").getByte("LeaveStatus")
        return {"RootPos" : rootPos, "SonLimbPos" : sonLimbPos, /**"LeaveStatus" : leaveStatus*/}
    },
}
