/**
 * 蜂巢构建器：
 * 用于生成偶数边长的六边形蜂巢
 * @param {Internal.Level} level 
 * @param {Internal.BlockPos} centerPos 
 */
function BeeBoxBuilder (level, centerPos){
    this.level = level
    // 该中心点不是几何中心点，只是以该中心点为基点生成六边形蜂巢
    this.centerX = centerPos.x
    this.centerY = centerPos.y
    this.centerZ = centerPos.z
    this.halfSideLength = Math.round(BeeBoxDefaultSize.boxLength / 2)
    this.wallHeight = BeeBoxDefaultSize.boxHigh - 1
    this.tier = "T0"
    this.type = "default"
    this.topBlock = 'kubejs:beebox_phantasm_block_7'
    this.wallBlock = [
        "kubejs:beebox_phantasm_block_7",
        "kubejs:beebox_phantasm_block_7",
        "kubejs:beebox_phantasm_block_7",
        "kubejs:beebox_phantasm_block_7",
        "kubejs:beebox_phantasm_block_7",
        "kubejs:beebox_phantasm_block_7"
    ]
    this.floorBlock = "kubejs:beebox_phantasm_block_7"
    this.biome = "minecraft:the_void"
    /**
     * @type {number[]}  门的状态，0为关闭，1为打开; 依次为[正北、东北、东南、正南、西南、西北、上、下]
     */
    this.doors = [0, 0, 0, 0, 0, 0, 0, 0]
    this.decorators = []
    this.structures = []
    /**
     * @type {BlockPos[][]} 六边形蜂巢的六个边的单位块坐标
     */
    this.sideUnits = []
    this.updateSideUnits()
}
BeeBoxBuilder.prototype = {
    /**
     * 生成完整六边形蜂巢； 
     * 依次生成生物群系、结构、封顶、地面、墙、装饰器、中心
     * @returns 
     */
    buildBox: function(){
        this.fillBiome(this.biome)
        // this.level.tell("biome done")
        this.buildStructure()
        // this.level.tell("structure done")
        this.buildFlat(this.wallHeight, this.topBlock, "dooreye")
        this.buildFlat(this.wallHeight - 1, this.topBlock, "dooreye")
        // this.level.tell("top done")
        this.buildFlat(0, this.floorBlock, "dooreye")
        this.buildFlat(1, this.floorBlock, "dooreye")
        // this.level.tell("floor done")
        this.buildAllWalls()
        // this.level.tell("walls done")
        this.buildAllDoors()
        // this.level.tell("doors done")
        this.buildDecorators()
        // this.level.tell("decorators done")
        this.buildCenter()
        // this.level.tell("center done")
        return this
    },
    /**
     * 根据wall_number对应的墙和当前box中心xyz，生成一个新的BeeBoxBuilder对象
     * @param {number} wall_number 从正北（Z轴负方向）开始，顺时针计算，每个边代表一个方向，依次为从0至5; 若为负数，则代表上或下，-1代表上，-2代表下
     * @returns 新的BeeBoxBuilder对象
     */
    extend : function(wall_number){
        wall_number = wall_number > 0 ? wall_number % 6 : wall_number
        let newX = this.centerX
        let newY = this.centerY
        let newZ = this.centerZ
        switch(wall_number){
            case 0 :
                newZ = this.centerZ - this.halfSideLength * 4
                break
            case 1 :
                newZ = this.centerZ - this.halfSideLength * 2
                newX = this.centerX +  (this.halfSideLength + 1) * 3 
                break
            case 2 :
                newZ = this.centerZ + this.halfSideLength * 2
                newX = this.centerX + (this.halfSideLength + 1) * 3 
                break
            case 3 :
                newZ = this.centerZ + this.halfSideLength * 4
                break
            case 4 :
                newZ = this.centerZ + this.halfSideLength * 2
                newX = this.centerX - (this.halfSideLength + 1) * 3 
                break
            case 5 :
                newZ = this.centerZ - this.halfSideLength * 2
                newX = this.centerX - (this.halfSideLength + 1) * 3 
                break
            case -1 :
                newY = this.centerY + this.wallHeight + 1
                break
            case -2 :               
                newY = this.centerY - this.wallHeight - 1
                break
            default :
                // newZ = this.centerZ - this.halfSideLength * 4
                break
        }
        return this.clone().setCenterPos(new BlockPos(newX, newY, newZ))
    },
    setWallBlock : function(wall_number, block){
        if(wall_number < 0) return this
        this.wallBlock[wall_number % 6] = block
        return this
    },
    setAllWallBlock : function(block){
        for(let i = 0; i < 6; i++){
            this.setWallBlock(i, block)
        }
        return this
    },
    setFloorBlock : function(block){
        this.floorBlock = block
        return this
    },
    setTopBlock : function(block){
        this.topBlock = block
        return this
    },
    /**
     * 设置蜂巢的尺寸
     * @param {number} sideLength 边长, 偶数整数, 至少为4
     * @param {number} high 蜂巢高度，至少为5
     * @returns 
     */
    setBoxSize : function(sideLength, high){
        if(high < 5){high = 5}
        if(sideLength < 4){sideLength = 4}
        this.halfSideLength = Math.round(sideLength / 2)
        this.wallHeight = high - 1
        return this.updateSideUnits()
    },
    /**
     * 设置tier
     * @param {string} tier "T0" | "T1" | "T2" | "T3" | "T4"
     * @returns 
     */
    setTier : function(tier){
        this.tier = tier
        return this
    },
    setType : function(type){
        this.type = type
        return this
    },
    /**
     * 设置对应墙或平面上的门
     * @param {number} wall_number 
     * @param {boolean} isOpen false为关；true为开
     * @returns 
     */
    setDoor : function(wall_number, isOpen){
        if(wall_number >= 0){
            this.doors[wall_number % 6] = isOpen ? 1 : 0
        }else{
            this.doors[5 - wall_number] = isOpen ? 1 : 0
        }
        return this
    },
    /**
     * 设置中心位置
     * @param {BlockPos} pos 
     * @returns 
     */
    setCenterPos : function(pos){
        this.centerX = pos.x
        this.centerY = pos.y
        this.centerZ = pos.z
        return this.updateSideUnits()
    },
    setBiome : function(biome){
        this.biome = biome
        return this
    },
    /**
     * 向蜂箱中添加结构
     * @param {string} path 结构路径
     * @param {BlockPos} offsetPos 相对坐标，相对于蜂箱中心的偏移量
     * @returns 
     */
    addStructure : function(path, offsetPos){
        this.structures.push({
            "path": path, 
            "offsetX": offsetPos.x,
            "offsetY": offsetPos.y,
            "offsetZ": offsetPos.z
        })
        return this
    },
    /**
     * 
     * @param {StructuresTypesPool} pool 
     * @returns 
     */
    addStructureRandomInPool(pool){
        let totalWeight = 0
        let currentWeight = 0
        Object.keys(pool).forEach(structureId => {
            let weight = pool[structureId].weight
            totalWeight += weight
        })
        let randomWeight = Math.random() * totalWeight
        for(let i = 0; i < Object.keys(pool).length; i++){
            let structureId = Object.keys(pool)[i]
            let weight = pool[structureId].weight
            currentWeight += weight
            if(currentWeight >= randomWeight){
                let offsetPos = pool[structureId].offset
                this.addStructure(`${structureId}`, offsetPos)
                break
            }
        }
        return this
    },
    /**
     * 使用BeeBoxDecorator中定义的装饰器, 详见beebox_decorator.js
     * @param {string} id 
     * @param {Internal.CompoundTag?} args 装饰器参数
     * @returns 
     */
    addDecorator : function(id, args){
        args = args ?? new $CompoundTag()
        this.decorators.push({
            "id" : id,
            "args" : args
        })
        return this
    },
    /**
     * 填充整个box的生物群系
     * @param {String} biome 生物群系id
     */
    fillBiome : function(biome){
        let currentStartPos
        let currentEndPos
        for(let i = 0; i < this.halfSideLength; i++){
            currentStartPos = this.sideUnits[1][i]  
            currentEndPos = this.sideUnits[4][i]
            this.level.server.runCommandSilent(`fillbiome ${currentStartPos.x + 1} ${this.centerY} ${currentStartPos.z} ${currentEndPos.x} ${this.centerY + this.wallHeight} ${currentStartPos.z + 1} ${biome}`)
            
            currentStartPos = this.sideUnits[2][i]
            currentEndPos = this.sideUnits[5][i]
            this.level.server.runCommandSilent(`fillbiome ${currentStartPos.x + 1} ${this.centerY} ${currentStartPos.z} ${currentEndPos.x} ${this.centerY + this.wallHeight} ${currentStartPos.z + 1} ${biome}`)
        }
        this.setBiome(biome)
        return this
    },
    /**
     * 在box范围内放置某方块
     * @param {BlockPos | BlockPos[]} pos 目标坐标，可以用数组表示多个坐标
     * @param {string} block 
     * @param {boolean?} includeShell 该范围是否包含外壳，默认true
     * @returns 
     */
    buildBlock : function(pos, block, includeShell){
        includeShell = includeShell ?? true
        this.findPosInBox(pos, includeShell).forEach(blockPos => {
            this.level.getBlock(blockPos).set(block)
        })
        return this
    },
    /**
     * 在对应的墙或平面上开个门
     * @param {number} wall_number 从正北（Z轴负方向）开始，顺时针计算，每个边代表一个方向，依次为从0至5; -1为上，-2为下
     * @returns 
     */
    buildDoor : function(wall_number){
        let doorBlock = "minecraft:yellow_stained_glass"
        this.setDoor(wall_number, true)
        if(wall_number >= 0) {
            let blockColumn = this.sideUnits[wall_number % 6]
            for(let i = 1; i < this.halfSideLength - 1; i++){
                let unit = blockColumn[i]
                blockColumnUnit(this.level, doorBlock, unit.x, unit.y + 2, unit.z, this.wallHeight - 4)
            }
        }else{
            if(wall_number == -1){
                this.buildFlat(this.wallHeight - 1, doorBlock)
                this.buildFlat(this.wallHeight, doorBlock)
            }
            if(wall_number == -2){
                this.buildFlat(0, doorBlock)
                this.buildFlat(1, doorBlock)
            }
        }
        return this
    },
    buildAllDoors : function(){
        for(let i = 0; i < this.doors.length; i++){
            if(this.doors[i] == 1){
                if(i < 6){
                    this.buildDoor(i % 6)
                }else{
                    this.buildDoor(- (i - 5))
                }
            }
        }
        return this
    },
    /**
     * 建造对应的墙
     * @param {number} wall_number 从正北（Z轴负方向）开始，顺时针计算，每个边代表一个方向，依次为从0至5
     * @param {boolean?} spawnEyes 可选，是否生成门眼, 默认true
     * @returns 
     */
    buildWall : function(wall_number, spawnEyes){
        spawnEyes = spawnEyes ?? true
        if(wall_number < 0) {return this}
        for(let j = 0; j < this.halfSideLength; j++){
            let unit = this.sideUnits[wall_number % 6][j]
            blockColumnUnit(this.level, this.wallBlock[wall_number % 6], unit.x, unit.y, unit.z, this.wallHeight)
        }
        if(!spawnEyes){return this}
        // 墙的信息
        let dooreye_1 = this.sideUnits[wall_number % 6][this.halfSideLength / 2].offset(0, this.wallHeight / 2 - 1, 0)
        let dooreye_2 = this.sideUnits[wall_number % 6][this.halfSideLength / 2 - 1].offset(0, this.wallHeight / 2 - 1, 0)
        let eyes_1 = blockColumnUnit(this.level, "kubejs:beebox_dooreye", dooreye_1.x, dooreye_1.y, dooreye_1.z, 3)
        let eyes_2 = blockColumnUnit(this.level, "kubejs:beebox_dooreye", dooreye_2.x, dooreye_2.y, dooreye_2.z, 3)
        eyes_1.forEach(block => {
            // let blockEntityData = block.getEntityData()
            // let wallData = blockEntityData.getCompound("data").getCompound("WallData")
            // wallData.putInt("wall_number", wall_number % 6)
            // wallData.putInt("box_center_x", this.centerX)
            // wallData.putInt("box_center_y", this.centerY)
            // wallData.putInt("box_center_z", this.centerZ)
            // block.mergeEntityData(blockEntityData)
            this.saveDooreyeData(block, wall_number % 6)
        })
        eyes_2.forEach(block => {
            // let blockEntityData = block.getEntityData()
            // let wallData = blockEntityData.getCompound("data").getCompound("WallData")
            // wallData.putInt("wall_number", wall_number % 6)
            // wallData.putInt("box_center_x", this.centerX)
            // wallData.putInt("box_center_y", this.centerY)
            // wallData.putInt("box_center_z", this.centerZ)
            // block.mergeEntityData(blockEntityData)
            this.saveDooreyeData(block, wall_number % 6)
        })
        return this
    },
    /**
     * 生成所有的墙
     * @param {boolean?} spawnEyes 可选，是否生成门眼, 默认true
     * @returns 
     */
    buildAllWalls : function(spawnEyes){
        spawnEyes = spawnEyes ?? true
        for(let i = 0; i < 6; i++){
            this.buildWall(i, spawnEyes)
        }
        return this
    },
    /**
     * 建造一层六边形平面
     * @param {number} offsetY 距离BOX底部的Y偏移量
     * @param {String} blockId 
     * @param {String?} type "keep" | "replace" | "dooreye", 可选
     */
    buildFlat : function(offsetY, blockId, type){
        type = type ?? "replace"
    //     let currentStartPos
    //     let currentEndPos
    //     let flatY = this.centerY + Math.min(offsetY, this.wallHeight)
    //     for(let i = 0; i < this.halfSideLength; i++){
    //         if(i > 0){
    //             currentStartPos = this.sideUnits[1][i]  
    //             currentEndPos = this.sideUnits[4][i]
    //             this.level.server.runCommandSilent(`fill ${currentStartPos.x - 1} ${flatY} ${currentStartPos.z} ${currentEndPos.x + 2} ${flatY} ${currentStartPos.z + 1} ${block} ${type}`)
    //         } 
    //         if(i < this.halfSideLength - 1){
    //             currentStartPos = this.sideUnits[2][i]
    //             currentEndPos = this.sideUnits[5][i]
    //             this.level.server.runCommandSilent(`fill ${currentStartPos.x - 1} ${flatY} ${currentStartPos.z} ${currentEndPos.x + 2} ${flatY} ${currentStartPos.z + 1} ${block} ${type}`)
    //         }
    //    }
       this.getFlatBlocks(offsetY, false).forEach(blockJS => {
            if(type == "replace"){
                blockJS.set(blockId)
            }else if(type == "keep" && blockJS.getId() == "minecraft:air"){
                blockJS.set(blockId)
            }else if(type == "dooreye"){
                blockJS.set(blockId)
                let wall_number = -3
                if(offsetY <= 1){
                    wall_number = -2
                }else if(offsetY >= this.wallHeight - 1){
                    wall_number = -1
                }
                for(let dx = -1; dx <= 2; dx++){
                    for(let dz = -1; dz <= 2; dz++){
                        let currrentBlock = this.getCenterBlock().offset(dx, offsetY, dz)
                        currrentBlock.set("kubejs:beebox_dooreye")
                        this.saveDooreyeData(currrentBlock, wall_number)
                    }
                }
            }
       })
       return this
    },
    /**
     * 在相对中心位置建造一个模板结构
     * @returns 
     */
    buildStructure : function(){
        this.structures.forEach((template) => {
            let path = template.path
            let offsetX = template.offsetX
            let offsetY = template.offsetY
            let offsetZ = template.offsetZ
            let startPos = this.getCenterBlock().pos.offset(offsetX, offsetY, offsetZ)
            this.level.server.runCommandSilent(`/place template ${path} ${startPos.x} ${startPos.y} ${startPos.z}`)
        })
        return this
    },
    /**
     * 
     * @returns 
     */
    buildDecorators : function(){
        this.decorators.forEach(decorator => {
            BeeBoxDecorator[decorator.id](this, decorator.args)
        })
        return this
    },
    buildCenter : function(){
        this.level.getBlock(this.centerX + 1, this.centerY, this.centerZ).set(this.floorBlock)
        this.level.getBlock(this.centerX, this.centerY, this.centerZ + 1).set(this.floorBlock)
        this.level.getBlock(this.centerX + 1, this.centerY, this.centerZ + 1).set(this.floorBlock)
        this.level.setBlockAndUpdate(new BlockPos(this.centerX, this.centerY, this.centerZ), Block.getBlock("kubejs:beebox_center").defaultBlockState())
        this.saveDataToCenter()
        return this
    },
    clone : function(){
        let newBox = new BeeBoxBuilder(this.level, new BlockPos(this.centerX, this.centerY, this.centerZ))
           .setFloorBlock(this.floorBlock)
           .setTopBlock(this.topBlock)
           .setBiome(this.biome)
           .setBoxSize(this.halfSideLength * 2, this.wallHeight + 1)
           .setTier(this.tier)
           .setType(this.type)
        newBox.wallBlock = this.wallBlock.slice()
        newBox.doors = this.doors.slice()
        newBox.structures = this.structures.slice()
        newBox.decorators = this.decorators.slice()
        newBox.updateSideUnits()
        return newBox
    },
    /**
     * 标记用于组成六边形蜂巢的柱子单元坐标， 更新sideUnits数组，用于buildWall
     * 
     * sideUnits[墙编号0 ~ 5][柱子编号0 ~ halfSideLength-1] = {x: number, y: number, z: number, block: string}
     */
    updateSideUnits : function(){
        let startPos = new BlockPos(this.centerX - this.halfSideLength + 1, this.centerY, this.centerZ - this.halfSideLength * 2 + 1)
        let halfLength = this.halfSideLength
        for(let i = 0; i < 6; i++){
            this.sideUnits[i] = []
        }
        for(let j = 0; j < halfLength; j++){
            this.sideUnits[0][j] = new BlockPos(startPos.x + j * 2, startPos.y, startPos.z)
            this.sideUnits[1][j] = new BlockPos(startPos.x + halfLength * 2 + j, startPos.y, startPos.z + j * 2)
            this.sideUnits[2][j] = new BlockPos(startPos.x + halfLength * 3 - 1 - j, startPos.y, startPos.z + halfLength * 2 + j * 2)
            this.sideUnits[3][j] = new BlockPos(startPos.x + (halfLength - 1) * 2 - j * 2, startPos.y, startPos.z + halfLength * 4 - 2)
            this.sideUnits[4][j] = new BlockPos(startPos.x - 2 - j, startPos.y, startPos.z + halfLength * 4 - 2 - j * 2)
            this.sideUnits[5][j] = new BlockPos(startPos.x - halfLength - 1 + j, startPos.y, startPos.z + halfLength * 2 - j * 2 - 2)
        }
        return this
    },
    /**
     * 
     * @param {Internal.BlockContainerJS} block 
     * @param {number} wall_number 
     */
    saveDooreyeData : function(block, wall_number){
        let blockEntityData = block.getEntityData()
        let wallData = blockEntityData.getCompound("data").getCompound("WallData")
        wallData.putInt("wall_number", wall_number % 6)
        wallData.putInt("box_center_x", this.centerX)
        wallData.putInt("box_center_y", this.centerY)
        wallData.putInt("box_center_z", this.centerZ)
        block.mergeEntityData(blockEntityData)
        return this
    },
    /**
     * 保存蜂箱信息到自身蜂箱中心
     */
    saveDataToCenter : function(){
        let centerBlockContainerJS = this.level.getBlock(this.centerX, this.centerY, this.centerZ)
        if(centerBlockContainerJS.getId() != "kubejs:beebox_center") {return this}
        // 处理蜂巢信息
        let BlockEntityData = centerBlockContainerJS.getEntityData()
        let boxData = BlockEntityData.getCompound("data").getCompound("BeeBoxData")
        boxData.putInt("boxLength", this.halfSideLength * 2)
        boxData.putInt("boxHigh", this.wallHeight + 1)
        boxData.putString("boxTier", this.tier)
        boxData.putString("boxType", this.type)
        boxData.putString("biome", this.biome)
        boxData.put("structures", NBT.listTag())
        for(let i = 0; i < this.structures.length; i++){
            /**
             * @type {Internal.CompoundTag[]} 
             */
            let structureList = boxData.get("structures")
            if(structureList.length < i + 1){
                structureList.push(NBT.compoundTag())
            }
            structureList[i].putString("path", this.structures[i].path)
            structureList[i].putInt("offsetX", this.structures[i].offsetX)
            structureList[i].putInt("offsetY", this.structures[i].offsetY)
            structureList[i].putInt("offsetZ", this.structures[i].offsetZ)
        }
        boxData.putString("top", this.topBlock)
        boxData.put("walls", NBT.listTag())
        for(let i = 0; i < 6; i++){
            boxData.get("walls").push(NBT.stringTag(this.wallBlock[i]))
        }
        boxData.put("doors", NBT.listTag())
        for(let i = 0; i < this.doors.length; i++){
            boxData.get("doors").push(NBT.byteTag(this.doors[i]))
        }
        boxData.putString("floor", this.floorBlock)
        boxData.put("decorators", NBT.listTag())
        for(let i = 0; i < this.decorators.length; i++){
             /**
             * @type {Internal.CompoundTag[]} 
             */
            let decorationList = boxData.get("decorators")
            if(decorationList.length < i + 1){
                decorationList.push(NBT.compoundTag())
            }
            decorationList[i].putString("id", this.decorators[i].id)
            decorationList[i].put("args", this.decorators[i].args)
        }
        centerBlockContainerJS.mergeEntityData(BlockEntityData) 
        return this
    },
    /**
     * 加载坐标处的蜂箱核心内的蜂箱组成数据
     * @param {BlockPos} centerPos  若为空则默认使用当前蜂箱中心坐标
     * @returns 
     */
    loadDataFromCenter : function(centerPos){
        centerPos = centerPos ?? new BlockPos(this.centerX, this.centerY, this.centerZ)
        let centerBlockContainerJS = this.level.getBlock(centerPos.x, centerPos.y, centerPos.z)
        if(centerBlockContainerJS.getId() != "kubejs:beebox_center") {return this}
        let BlockEntityData = centerBlockContainerJS.getEntityData()
        // let boxData = BlockEntityData.getCompound("componentManager").getCompound("data_component").getCompound("BeeBoxData")
        let boxData = BlockEntityData.getCompound("data").getCompound("BeeBoxData")
        this.halfSideLength = boxData.getInt("boxLength") / 2
        this.wallHeight = boxData.getInt("boxHigh") - 1
        this.tier = boxData.getString("boxTier")
        this.type = boxData.getString("boxType")
        this.biome = boxData.getString("biome")
        this.floorBlock = boxData.getString("floor")
        this.topBlock = boxData.getString("top")
        /**
         * @type {Internal.CompoundTag[]} 
         */        
        let structureList = boxData.get("structures")
        for(let i = 0; i < structureList.length; i++){
            let id = structureList[i].getString("path")
            let offset = new BlockPos(structureList[i].getInt("offsetX"), structureList[i].getInt("offsetY"), structureList[i].getInt("offsetZ"))
            this.addStructure(id, offset)
        }
        let wallsList = boxData.get("walls")
        for(let i = 0; i < wallsList.length; i++){
            this.setWallBlock(i, String(wallsList[i]))
        }
        let doorsList = boxData.get("doors")
        for(let i = 0; i < doorsList.length; i++){
            this.setDoor(i, doorsList[i])
        }
        /**
         * @type {Internal.CompoundTag[]} 
         */     
        let decorationList = boxData.get("decorators")
        for(let i = 0; i < decorationList.length; i++){
            this.addDecorator(String(decorationList[i]), decorationList[i].getCompound("args"))
        }
        this.updateSideUnits()
        return this
    },
    getCenterBlock : function(){
        return this.level.getBlock(this.centerX, this.centerY, this.centerZ)
    },
    /**
     * 获取蜂巢尺寸
     * @returns {number[]} [ boxLength , boxHigh ]
     */
    getBoxSize : function(){
        return [this.halfSideLength * 2, this.wallHeight + 1]
    },
    /**
     * 获取一个蜂箱中心Y轴偏移平面内的方块
     * @param {number} offsetY 
     * @param {boolean?} includeWall 是否包含墙壁，默认为false
     * @returns {Internal.BlockContainerJS[]}
     */
    getFlatBlocks : function(offsetY, includeWall){
        let blockList = []
        includeWall = includeWall ?? false
        let y = this.centerY + offsetY
        let iMax = this.halfSideLength - 1
        for(let i = includeWall ? 0 : 1; i < iMax + 1; i++){
            let enPos = this.sideUnits[1][i]
            let esPos = this.sideUnits[2][iMax - i]
            let wnPos = this.sideUnits[5][iMax - i]
            let wsPos = this.sideUnits[4][i]
            // 北半部分
            let nx1 = includeWall ? wnPos.x : wnPos.x + 2
            let nx2 = includeWall ? enPos.x + 1: enPos.x - 1
            for(let x = nx1; x <= nx2; x++){
                for(let z = wnPos.z; z <= enPos.z + 1; z++){
                    let pos = new BlockPos(x,y,z)
                    blockList.push(this.level.getBlock(pos))
                }
            }
            // 南半部分
            let sx1 = includeWall ? wsPos.x : wsPos.x + 2
            let sx2 = includeWall ? esPos.x + 1 : esPos.x - 1
            for(let x = sx1; x <= sx2; x++){
                for(let z = wsPos.z; z <= esPos.z + 1; z++){
                    let pos = new BlockPos(x,y,z)
                    blockList.push(this.level.getBlock(pos))
                }
            }
        }
        return blockList
    },
    getTierByNumber : function(){
        let tierNumber = 0
        switch(this.tier){
            case "T0" : tierNumber = 0; break;
            case "T1" : tierNumber = 1; break;
            case "T2" : tierNumber = 2; break;
            case "T3" : tierNumber = 3; break;
            case "T4" : tierNumber = 4; break;
            default: tierNumber = 0; break;
        }
        return tierNumber
    },
    /**
     * 获取box的各轴坐标范围
     * @param {string} xyz "x" | "y" | "z" | "all" (可选，默认all)
     * @returns {Array} [xScope, yScope, zScope]
     * @returns 
     */
    getBoxPosScope : function(xyz){
        xyz = xyz ?? "all"
        let xScope = [this.sideUnits[5][0].x, this.sideUnits[2][0].x + 1]
        let yScope = [this.centerY, this.centerY + this.wallHeight]
        let zScope = [this.sideUnits[0][0].z, this.sideUnits[3][0].z + 1]
        switch(xyz){
            case "x":
                return xScope
            case "y":
                return yScope
            case "z":
                return zScope
            case "all":
                return [xScope, yScope, zScope]
            default:
                return [xScope, yScope, zScope]
        }
    },
    /**
     * 使用BeeBoxPresets里的预设方案
     * @param {String} id 
     * @param {Object} ags 预设参数，可选
     * @returns {BeeBoxBuilder}
     */
    preset : function(id){
        let pos = new BlockPos(this.centerX, this.centerY, this.centerZ)
        if(BeeBoxPresets.hasOwnProperty(id)){
            return BeeBoxPresets[id](this.level, pos).builder
        }
        else return BeeBoxPresets["default"](this.level, pos).builder
    },
    /**
     * 在预设权重map中随机选择一个预设方案
     * @param {BeeBoxTypesPool} pool    - global.xxxPool["xxx"]
     * @param {boolean} ignoreWeight 
     * @returns 
     */
    presetRandomInPool : function(pool, ignoreWeight){
        ignoreWeight = ignoreWeight ?? false
        let persetList = Object.keys(pool)
        if(ignoreWeight){
            let bbb = new BeeBoxBuilder(this.level, pos).preset(randomInList(persetList))
            return bbb
        }else{
            let pos = new BlockPos(this.centerX, this.centerY, this.centerZ)
            let totalWeight = 0
            let currentWeight = 0
            persetList.forEach(presetId => {
                let weight = pool[presetId]
                totalWeight += weight
            })
            let randomWeight = Math.floor(Math.random() * totalWeight)
            for(let i = 0; i < persetList.length; i++){
                let presetId = persetList[i]
                let weight = pool[presetId]
                currentWeight += weight
                if(randomWeight <= currentWeight){
                    let bbb = new BeeBoxBuilder(this.level, pos).preset(presetId)
                    return bbb
                }
            }
        }
        return this
    },
    /**
     * 判断坐标是否在蜂箱范围内,返回在蜂箱范围内的坐标
     * @param {BlockPos[] | BlockPos} blockPos 
     * @param {boolean?} includeShell 是否包含蜂箱壳体，默认为true
     * @returns {[]}
     */
    findPosInBox : function(blockPos, includeShell){
        // 
        includeShell = includeShell ?? true
        function checkPos(bbb, targetPos, includeShell){
            if(targetPos.y < bbb.centerY || targetPos.y > bbb.centerY + bbb.wallHeight){return false}
            let iMax = bbb.halfSideLength - 1
            for(let i = includeShell ? 0 : 1; i < bbb.halfSideLength; i++){
                let enPos = bbb.sideUnits[1][i]
                let esPos = bbb.sideUnits[2][iMax - i]
                let wnPos = bbb.sideUnits[5][iMax - i]
                let wsPos = bbb.sideUnits[4][i]
                if(includeShell){
                    if(targetPos.x <= (enPos.x + 1) && targetPos.x >= wnPos.x && targetPos.z >= enPos.z && targetPos.z <= enPos.z + 1){
                        return true
                    }
                    if(targetPos.x <= (esPos.x + 1) && targetPos.x >= wsPos.x && targetPos.z >= esPos.z && targetPos.z <= esPos.z + 1){
                        return true
                    }
                }else{
                    if(targetPos.x <= (enPos.x - 1) && targetPos.x >= wnPos.x + 2 && targetPos.z >= enPos.z && targetPos.z <= enPos.z + 1){
                        return true
                    }
                    if(targetPos.x <= (esPos.x - 1) && targetPos.x >= wsPos.x + 2 && targetPos.z >= esPos.z && targetPos.z <= esPos.z + 1){
                        return true
                    }
                }
            }
            return false
        }

        let result = []
        if(Array.isArray(blockPos)){
            blockPos.forEach(pos => {
                if(checkPos(this, pos, includeShell)){
                    result.push(pos) 
                }
            })
        }else{
            if(checkPos(this, blockPos, includeShell)){
                result.push(blockPos) 
            }
        }
        return result
    },
    clearDecorators : function(){
        this.decorators = []
        return this
    },
    clearStructures : function(){
        this.structures = []
        return this
    },
}



