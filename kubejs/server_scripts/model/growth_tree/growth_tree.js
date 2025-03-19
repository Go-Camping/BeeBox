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
    /**
     * 养分值 -
     */
    this.nutrientAmount = 0 
    this.leaveBlock = "minecraft:mangrove_leaves"//minecraft:glass"//'minecraft:sculk'
    this.budLeaveBlock = 'minecraft:moss_block'
    /**
     * 树干方块
     */
    this.limbBlock = "kubejs:zenith_clouds_log"
    /**
     * @type {BlockPos[]} 树干的坐标 -
     */
    this.limbPos = []
    /**
     * @type {BlockPos[]} 果实的坐标 -
     */
    this.fruitPos = []
    this.fruitState = 0
    this.fruitBlock = "kubejs:zenith_clouds_fruit"
    /**
     * @type {BlockPos[]} 芽的坐标 -
     */
    this.budPos = []
    /**
     * 最大分支数 -
     */
    this.maxBranch = 7
    /**
     * 允许分支生长的树龄 -
     */
    this.branchGrowTreeAge = 5
    /**
     * 当前树龄 -
     */
    this.treeAge = 0
    /**
     * 最大树龄 -
     */
    this.maxTreeAge = 30
    /**
     * 开始生长果实的树龄 - 
     */
    this.fruitGrowTreeAge = this.maxTreeAge / 2 + this.branchGrowTreeAge
    /**
     * 树的类型 -
     */
    this.treeType = treeType ?? "kubejs:common_tree"
}
GrowthTree.prototype = {
    /**
     * 进行a次生长，包括分支生长，芽生长，果实生长
     * 
     * @param {number} a 生长次数
     * @returns 
     */
    growUp(a) {
        a = a ?? this.maxTreeAge
        this.budFindRootPath()
        for(let i = 0; i < a; i++){
            if(!this.checkTreeStopGrow()){return}
            if(!this.checkRootRequire()){return}
            this.growNewBud()
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
        let rootBlock = this.level.getBlock(this.rootPos)
        if(!rootBlock.hasTag('kubejs:growth_root')){return this}
        let entityData = rootBlock.entityData
        let TreeData = entityData.getCompound('data').getCompound('TreeData')
        TreeData.putInt('maxTreeAge', maxTreeAge)
        rootBlock.mergeEntityData(entityData)
        return this
    },
    setBranchGrowTreeAge(branchGrowTreeAge){
        this.branchGrowTreeAge = branchGrowTreeAge
        let rootBlock = this.level.getBlock(this.rootPos)
        if(!rootBlock.hasTag('kubejs:growth_root')){return this}
        let entityData = rootBlock.entityData
        let TreeData = entityData.getCompound('data').getCompound('TreeData')
        TreeData.putInt('branchGrowTreeAge', branchGrowTreeAge)
        rootBlock.mergeEntityData(entityData)
        return this
    },
    setLeaveBlock(leaveBlock){
        this.leaveBlock = leaveBlock
        let rootBlock = this.level.getBlock(this.rootPos)
        if(!rootBlock.hasTag('kubejs:growth_root')){return this}
        let entityData = rootBlock.entityData
        let TreeData = entityData.getCompound('data').getCompound('TreeData')
        TreeData.putString('leaveBlock', leaveBlock)
        rootBlock.mergeEntityData(entityData)
        return this
    },
    setBudLeaveBlock(budLeaveBlock){
        this.budLeaveBlock = budLeaveBlock
        let rootBlock = this.level.getBlock(this.rootPos)
        if(!rootBlock.hasTag('kubejs:growth_root')){return this}
        let entityData = rootBlock.entityData
        let TreeData = entityData.getCompound('data').getCompound('TreeData')
        TreeData.putString('budLeaveBlock', budLeaveBlock)
        rootBlock.mergeEntityData(entityData)
        return this
    },
    setNutrientBlock(nutrientBlock){
        this.nutrientBlock = nutrientBlock
        let rootBlock = this.level.getBlock(this.rootPos)
        if(!rootBlock.hasTag('kubejs:growth_root')){return this}
        let entityData = rootBlock.entityData
        let TreeData = entityData.getCompound('data').getCompound('TreeData')
        TreeData.putString('nutrientBlock', nutrientBlock)
        rootBlock.mergeEntityData(entityData)
        return this
    },
    setLimbBlock(limbBlock){
        this.limbBlock = limbBlock
        let rootBlock = this.level.getBlock(this.rootPos)
        if(!rootBlock.hasTag('kubejs:growth_root')){return this}
        let entityData = rootBlock.entityData
        let TreeData = entityData.getCompound('data').getCompound('TreeData')
        TreeData.putString('limbBlock', limbBlock)
        rootBlock.mergeEntityData(entityData)
        return this
    },
    setFruitBlock(fruitBlock){
        this.fruitBlock = fruitBlock
        let rootBlock = this.level.getBlock(this.rootPos)
        if(!rootBlock.hasTag('kubejs:growth_root')){return this}
        let entityData = rootBlock.entityData
        let TreeData = entityData.getCompound('data').getCompound('TreeData')
        TreeData.putString('fruitBlock', fruitBlock)
        rootBlock.mergeEntityData(entityData)
        return this
    },
    setMaxBranch(maxBranch){
        this.maxBranch = maxBranch
        let rootBlock = this.level.getBlock(this.rootPos)
        if(!rootBlock.hasTag('kubejs:growth_root')){return this}
        let entityData = rootBlock.entityData
        let TreeData = entityData.getCompound('data').getCompound('TreeData')
        TreeData.putInt('maxBranch', maxBranch)
        rootBlock.mergeEntityData(entityData)
        return this
    },
    setFruitGrowTreeAge(fruitGrowTreeAge){
        this.fruitGrowTreeAge = fruitGrowTreeAge
        let rootBlock = this.level.getBlock(this.rootPos)
        if(!rootBlock.hasTag('kubejs:growth_root')){return this}
        let entityData = rootBlock.entityData
        let TreeData = entityData.getCompound('data').getCompound('TreeData')
        TreeData.putInt('fruitGrowTreeAge', fruitGrowTreeAge)
        rootBlock.mergeEntityData(entityData)
        return this
    },
    setTreeType(treeType){
        this.treeType = treeType
        let rootBlock = this.level.getBlock(this.rootPos)
        if(!rootBlock.hasTag('kubejs:growth_root')){return this}
        let entityData = rootBlock.entityData
        let TreeData = entityData.getCompound('data').getCompound('TreeData')
        TreeData.putString('treeType', treeType)
        rootBlock.mergeEntityData(entityData)
        return this
    },
    /**
     * 检查根的生长需求
     */
    checkRootRequire(){
        let rootBlock = this.level.getBlock(this.rootPos)
        let vaildBlockList = this.findAroundVaildPos(this.rootPos, (aroundPos) => {
            let aroundBlock = this.level.getBlock(aroundPos)
            // 根旁边4个方块需要为泥土标签
            if(PosEqual(aroundBlock.getDown().pos, rootBlock.pos) || PosEqual(aroundBlock.getUp().pos, rootBlock.pos)){
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
     * 检查树能否生长
     * @returns {boolean}
     */
    checkTreeStopGrow() {
        let isPass = true
        // 检查年龄
        if(this.treeAge >= this.maxTreeAge){
            this.level.getBlock(this.rootPos).set(this.limbBlock)
            isPass = false
            return isPass
        }
        // 检查芽的数量
        if(this.budPos.length == 0){
            if(this.treeAge == 0){
            }
            else{
                this.level.getBlock(this.rootPos).set(this.limbBlock)
                isPass = false
                return isPass
            }
        }
        return isPass
    },
    /**
     * 果实生长
     */
    growFruit() {
        let ageFlag = this.treeAge == this.maxTreeAge - 1
        let fruitFlag1 = Math.random() < 0.05 && this.fruitGrowTreeAge <= this.treeAge
        let fruitFlag2 = this.budPos.length >= 3
        // 树龄即将最大时强制结果
        if(ageFlag){
            this.budPos.forEach(bud => {
                this.level.getBlock(bud).set(this.fruitBlock)
                this.growLeave(bud, 3, 2, 3, 5)
                this.fruitPos.push(bud)
            })
            this.budPos = []
        }
        // 树有若干分叉时有概率提前结果
        this.budPos.forEach((bud, index) => {
            if(fruitFlag1 && fruitFlag2){
                this.level.getBlock(bud).set(this.fruitBlock)
                this.growLeave(bud, 3, 2, 3, 5)
                this.fruitPos.push(bud)
                this.budPos.splice(index, 1)
            }
        })
        return this
    },
    /**
     * 芽的分裂行为
     * @returns 
     */
    growNewBud(){
        if(this.budPos.length < this.maxBranch){
            // 树龄到某值才能分裂
            let flag1 = this.treeAge > 5
            // 树龄到某值必定分裂一次
            let flag2 = this.treeAge == 5
            // 随机分裂
            let flag3 = Math.random() < 0.05
            if((flag3 && flag1) || flag2){
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
            this.placeLimbBlock(this.budPos[0], this.rootPos)
            return this
        }
        let result = []
        // 遍历当前生长的芽
        for(let i = 0; i < this.budPos.length; i++){
            let currentBudPos = this.budPos[i]
            let nextBudPos = randomInList(this.findAroundVaildPos(currentBudPos, (aroundPos) => {
                let aroundBlock = this.level.getBlock(aroundPos)
                // 禁止向下生长
                let flag1 = aroundBlock.y >= currentBudPos.y
                // 只能往空气或自己的树叶里长
                let flag2 = aroundBlock.getId() == "minecraft:air" || aroundBlock.getId() == this.leaveBlock || aroundBlock.getId() == this.budLeaveBlock
                // 向水平四周生长时下方不能为limb
                let flag3 = aroundBlock.offset(0, -1, 0).getId() != this.limbBlock || PosEqual(aroundBlock.pos.offset(0, -1, 0), currentBudPos)
                // 树龄到达某值之前只能向上生长
                let flag4 = this.treeAge >= this.branchGrowTreeAge || PosEqual(aroundBlock.pos.offset(0, -1, 0), currentBudPos)
                return flag1 && flag2 && flag3 && flag4
            }))
            if(nextBudPos){
                result.push(nextBudPos)
                this.placeLimbBlock(nextBudPos, currentBudPos)
                // 生长时的芽叶
                this.findAroundVaildPos(currentBudPos, (aroundPos) => {
                    let aroundBlock = this.level.getBlock(aroundPos)
                    return aroundBlock.getId() == this.budLeaveBlock
                }).forEach(pos => {
                    this.level.getBlock(pos).set("minecraft:air")
                })
                this.findAroundVaildPos(nextBudPos, (aroundPos) => {
                    let aroundBlock = this.level.getBlock(aroundPos)
                    return aroundBlock.getId() == "minecraft:air"
                }).forEach(pos => {
                    this.level.getBlock(pos).set(this.budLeaveBlock)
                })
                // 较大的树叶团
                if(Math.random() < 0.3 && this.treeAge > 5){
                    this.growLeave(nextBudPos, 3, 2, 3, 5)
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
     * 遍历所有的芽，寻找其生长路径，如果某芽无法按生长路径寻找到根，则移除根方块实体数据中 该芽到破损位置路径 所对应的数据
     * @returns 
     */
    budFindRootPath(){
        this.budPos.forEach((budP, budIndex) => {
            // this.level.tell("check bud" + this.budPos[budIndex])
            let rootBlock = this.level.getBlock(this.rootPos)
            let branchPathPosList = []
            let limb = budP
            for(let i = 0; i < this.maxTreeAge; i++){
                let currentlimbBlock = this.level.getBlock(limb)
                branchPathPosList.push(limb)
                if(currentlimbBlock.id == this.limbBlock || currentlimbBlock.id == this.fruitBlock){
                    limb = this.getDataFromLimb(limb).ParentLimbPos
                    continue
                }else if(currentlimbBlock.id != rootBlock.id){
                    branchPathPosList.forEach((pos) => {
                        let index = this.limbPos.findIndex((blockPos) => {
                            return PosEqual(blockPos, pos)
                        })
                        if(index >= 0){
                            this.level.getBlock(this.limbPos[index]).set("minecraft:magma_block")
                            this.limbPos.splice(index,1)
                        }
                    })
                    this.level.getBlock(this.budPos[budIndex]).set("minecraft:magma_block")
                    this.budPos.splice(budIndex,1)
                    break
                }else{
                    break
                }
            }
        })
        // this.level.tell("tree age: " + this.treeAge)
        this.saveDataToRoot()
        return this
    },
    /**
     * 
     * @param {BlockPos} pos 
     * @returns 
     */
    growLeave(pos, xLength, yLength, zLength, maxRangSqr){
        // this.level.tell("grow leave")
        xLength = xLength ?? 3 
        yLength = yLength ?? 2
        zLength = zLength ?? 3
        maxRangSqr = maxRangSqr ?? 5 
        for(let x = 0; x < xLength; x = x > 0 ? - x : 1 - x){
            for(let z = 0; z < zLength; z = z > 0 ? - z : 1 - z){
                for(let y = 0; y < yLength; y = y > 0 ? - y : 1 - y){
                    let block = this.level.getBlock(pos.x + x, pos.y + y, pos.z + z)//.offset(x, y, z)//
                    let distSqr = block.pos.distSqr(pos)
                    if(distSqr > maxRangSqr) {
                        continue
                    }
                    if(block.id == "minecraft:air" || block.id == this.budLeaveBlock){
                        block.set(this.leaveBlock)
                    }
                }
            }
        }
        return this
    },
    /**
     * 放置目标limb并记录目标limb的上个节点坐标；如果上个为空则默认为targetLimbPos
     * 
     * @param {BlockPos} targetLimbPos 
     * @param {BlockPos?} parentLimbPos 
     * @returns 
     */
    placeLimbBlock(targetLimbPos, parentLimbPos){
        parentLimbPos = parentLimbPos ?? targetLimbPos
        this.level.getBlock(targetLimbPos).set(this.limbBlock)
        this.limbPos.push(targetLimbPos)
        // let leaveStatus = randomInList([0, 0, 0, 0, 1])
        this.putDataToLimb(targetLimbPos, parentLimbPos/**, leaveStatus*/)
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
        if(!rootBlock.hasTag("kubejs:growth_root")){
            return this
        }
        let entityData = rootBlock.getEntityData()
        entityData.getCompound("data").put("TreeData", NBT.compoundTag())
        let treeData = entityData.getCompound("data").getCompound("TreeData")
        treeData.putString("treeType", this.treeType)
        treeData.putInt("treeAge", this.treeAge)
        treeData.putInt("maxTreeAge", this.maxTreeAge)
        treeData.putInt("branchGrowTreeAge", this.branchGrowTreeAge)
        treeData.putInt("fruitGrowTreeAge", this.fruitGrowTreeAge)
        treeData.putInt("maxBranch", this.maxBranch)
        treeData.putInt("nutrientAmount", this.nutrientAmount)
        treeData.putString("nutrientBlock", this.nutrientBlock)
        treeData.putString("leaveBlock", this.leaveBlock)
        treeData.putString("budLeaveBlock", this.budLeaveBlock)
        treeData.putString("limbBlock", this.limbBlock)
        treeData.putString("fruitBlock", this.fruitBlock)
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
        if(!rootBlock.hasTag("kubejs:growth_root")){
            return this
        }
        let entityData = rootBlock.getEntityData()
        let treeData = entityData.getCompound("data").getCompound("TreeData")
        GTree.treeType = treeData.getString("treeType")
        GTree.treeAge = treeData.getInt("treeAge")
        GTree.maxTreeAge = treeData.getInt("maxTreeAge")
        GTree.branchGrowTreeAge = treeData.getInt("branchGrowTreeAge")
        GTree.fruitGrowTreeAge = treeData.getInt("fruitGrowTreeAge")
        GTree.maxBranch = treeData.getInt("maxBranch")
        GTree.nutrientAmount = treeData.getInt("nutrientAmount")
        GTree.nutrientBlock = treeData.getString("nutrientBlock")
        GTree.leaveBlock = treeData.getString("leaveBlock")
        GTree.budLeaveBlock = treeData.getString("budLeaveBlock")
        GTree.limbBlock = treeData.getString("limbBlock")
        GTree.fruitBlock = treeData.getString("fruitBlock")
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
     * @param {BlockPos} parentLimbPos 目标limb的上个节点的坐标
     * @returns 
     */
    putDataToLimb(pos, parentLimbPos){
        let limbBlock = this.level.getBlock(pos)
        let entityData = limbBlock.getEntityData()
        entityData.getCompound("data").put("RootPos", Pos2NBT(this.rootPos))
        // TODO: 保存所在分枝信息
        entityData.getCompound("data").put("ParentLimbPos", Pos2NBT(parentLimbPos))
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
        let parentLimbPos = entityData.getCompound("data").getCompound("ParentLimbPos")
        // let leaveStatus = entityData.getCompound("data").getByte("LeaveStatus")
        return {"RootPos" : NBT2Pos(rootPos), "ParentLimbPos" : NBT2Pos(parentLimbPos), /**"LeaveStatus" : leaveStatus*/}
    },
    getTreeData(){
        return this.level.getBlock(this.rootPos).entityData.getCompound('data').getCompound('TreeData')
    }
}
