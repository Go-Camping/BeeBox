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
    this.topBlock = 'minecraft:yellow_stained_glass'
    this.wallBlock = [
        "minecraft:stone",
        "minecraft:blue_ice",
        "minecraft:oak_log",
        "minecraft:honeycomb_block",
        "minecraft:smooth_red_sandstone",
        "minecraft:prismarine"
    ]
    this.floorBlock = "kubejs:beehive"
    this.biome = "minecraft:cold_ocean"
    this.decorations = []
    this.structures = []
    /**
     * @type {BlockPos[][]} 六边形蜂巢的六个边的单位块坐标
     */
    this.sideUnits = []
    this.updateSideUnits()
}
BeeBoxBuilder.prototype = {
    /**
     * 生成完整六边形蜂巢
     * @returns 
     */
    buildBox: function(){
        // 生成地面、封顶、生物群系、结构
        this.fillBiome(this.biome)
        this.buildStructure()
        this.buildFlat(this.wallHeight, this.topBlock, "replace")
        this.buildFlat(0, this.floorBlock, "replace")
        // 生成墙
        for(let i = 0; i < 6; i++){
            this.buildWall(i)
        }    
        this.buildDecorations()
        this.buildCenter()
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
     * @param {number} sideLength 边长
     * @param {number} high 蜂巢高度，至少为3
     * @returns 
     */
    setBoxSize : function(sideLength, high){
        if(high < 3){high = 3}
        this.halfSideLength = Math.round(sideLength / 2)
        this.wallHeight = high - 1
        return this.updateSideUnits()
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
     * @param {string} id 结构id
     * @param {BlockPos} offsetPos 相对坐标，相对于蜂箱中心的偏移量
     * @returns 
     */
    addStructure : function(id, offsetPos){
        this.structures.push({"id": id, "offsetPos": offsetPos})
        return this
    },
    addDecoration : function(id){
        this.decorations.push(id)
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
        return this
    },
    /**
     * 在对应的墙上开个门
     * @param {number} wall_number 从正北（Z轴负方向）开始，顺时针计算，每个边代表一个方向，依次为从0至5
     * @returns 
     */
    buildDoor : function(wall_number){
        if(wall_number < 0) return this
        let blockColumn = this.sideUnits[wall_number % 6]
        for(let i = 1; i < this.halfSideLength - 1; i++){
            let unit = blockColumn[i]
            blockColumnUnit(this.level, "air", unit.x, unit.y + 1, unit.z, this.wallHeight - 2)
        }
        return this
    },
    /**
     * 建造对应的墙
     * @param {number} wall_number 从正北（Z轴负方向）开始，顺时针计算，每个边代表一个方向，依次为从0至5
     * @returns 
     */
    buildWall : function(wall_number){
        if(wall_number < 0) return this
        for(let j = 0; j < this.halfSideLength; j++){
            let unit = this.sideUnits[wall_number % 6][j]
            blockColumnUnit(this.level, this.wallBlock[wall_number % 6], unit.x, unit.y, unit.z, this.wallHeight)
        }
        return this
    },
    /**
     * 建造一层六边形平面
     * @param {number} offsetY 距离BOX底部的Y偏移量
     * @param {*} block 
     * @param {String} type "keep" | "replace"
     */
    buildFlat : function(offsetY, block, type){
        let currentStartPos
        let currentEndPos
        let flatY = this.centerY + Math.min(offsetY, this.wallHeight)
        for(let i = 0; i < this.halfSideLength; i++){
            if(i > 0){
                currentStartPos = this.sideUnits[1][i]  
                currentEndPos = this.sideUnits[4][i]
                this.level.server.runCommandSilent(`fill ${currentStartPos.x - 1} ${flatY} ${currentStartPos.z} ${currentEndPos.x + 2} ${flatY} ${currentStartPos.z + 1} ${block} ${type}`)
            } 
            if(i < this.halfSideLength - 1){
                currentStartPos = this.sideUnits[2][i]
                currentEndPos = this.sideUnits[5][i]
                this.level.server.runCommandSilent(`fill ${currentStartPos.x - 1} ${flatY} ${currentStartPos.z} ${currentEndPos.x + 2} ${flatY} ${currentStartPos.z + 1} ${block} ${type}`)
            }
       }
       this.buildCenter()
       return this
    },
    /**
     * 在相对中心位置建造一个模板结构
     * @param {string} id  template id
     * @param {BlockPos} offsetPos  相对坐标，相对于蜂箱中心的偏移量
     * @returns 
     */
    buildStructure : function(){
        this.structures.forEach(template => {
            let id = template.id
            let offsetPos = template.offsetPos
            this.level.server.runCommandSilent(`/place template ${id} ${this.centerX + offsetPos.x} ${this.centerY + offsetPos.y} ${this.centerZ + offsetPos.z}`)
        })
        return this
    },
    buildDecorations : function(){
        this.decorations.forEach(id => {
            BeeBoxDecorater[id](this)
        })
        return this
    },
    buildCenter : function(){
        this.level.getBlock(this.centerX + 1, this.centerY, this.centerZ).set(this.floorBlock)
        this.level.getBlock(this.centerX, this.centerY, this.centerZ + 1).set(this.floorBlock)
        this.level.getBlock(this.centerX + 1, this.centerY, this.centerZ + 1).set(this.floorBlock)
        this.level.setBlockAndUpdate(new BlockPos(this.centerX, this.centerY, this.centerZ), Block.getBlock("kubejs:beebox_center").defaultBlockState())
        let centerBlockContainerJS = this.level.getBlock(this.centerX, this.centerY, this.centerZ)
        // 处理蜂巢信息
        let BlockEntityData = centerBlockContainerJS.getEntityData()
        BlockEntityData.getCompound("componentManager").getCompound("data_component").put("BeeboxData", NBT.compoundTag())
        let boxData = BlockEntityData.getCompound("componentManager").getCompound("data_component").getCompound("BeeboxData")
        boxData.putInt("boxLength", this.halfSideLength * 2)
        boxData.putInt("boxHigh", this.wallHeight + 1)
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
            structureList[i].putString("id", this.structures[i].id)
            structureList[i].put("offset", NBT.compoundTag())
            structureList[i].getCompound("offset").putInt("x", this.structures[i].offsetPos.x)
            structureList[i].getCompound("offset").putInt("y", this.structures[i].offsetPos.y)
            structureList[i].getCompound("offset").putInt("z", this.structures[i].offsetPos.z)
        }
        boxData.putString("top", this.topBlock)
        boxData.put("walls", NBT.listTag())
        for(let i = 0; i < 6; i++){
            boxData.get("walls").push(NBT.stringTag(this.wallBlock[i]))
        }
        boxData.putString("floor", this.floorBlock)
        boxData.put("decorations", NBT.listTag())
        for(let i = 0; i < this.decorations.length; i++){
            boxData.get("decorations").push(NBT.stringTag(this.decorations[i]))
        }
        centerBlockContainerJS.mergeEntityData(BlockEntityData) 
        return this
    },
    clone : function(){
        let newBox = new BeeBoxBuilder(this.level, new BlockPos(this.centerX, this.centerY, this.centerZ))
           .setFloorBlock(this.floorBlock)
           .setTopBlock(this.topBlock)
           .setBiome(this.biome)
           .setBoxSize(this.halfSideLength * 2, this.wallHeight + 1)
        newBox.wallBlock = this.wallBlock.slice()
        newBox.structures = this.structures.slice()
        newBox.decorations = this.decorations.slice()
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
     * 加载坐标处的蜂箱中心内的蜂箱组成数据
     * @param {BlockPos} centerPos  若为空则默认使用当前蜂箱中心坐标
     * @returns 
     */
    loadCenterData : function(centerPos){
        centerPos = centerPos ?? new BlockPos(this.centerX, this.centerY, this.centerZ)
        let centerBlockContainerJS = this.level.getBlock(centerPos.x, centerPos.y, centerPos.z)
        if(centerBlockContainerJS.getId() != "kubejs:beebox_center") {return this}
        let BlockEntityData = centerBlockContainerJS.getEntityData()
        let boxData = BlockEntityData.getCompound("componentManager").getCompound("data_component").getCompound("BeeboxData")
        this.halfSideLength = boxData.getInt("boxLength") / 2
        this.wallHeight = boxData.getInt("boxHigh") - 1
        this.biome = boxData.getString("biome")
        this.floorBlock = boxData.getString("floor")
        this.topBlock = boxData.getString("top")
        /**
         * @type {Internal.CompoundTag[]} 
         */        
        let structureList = boxData.get("structures")
        for(let i = 0; i < structureList.length; i++){
            let id = structureList[i].getString("id")
            let offset = new BlockPos(structureList[i].getCompound("offset").getInt("x"), structureList[i].getCompound("offset").getInt("y"), structureList[i].getCompound("offset").getInt("z"))
            this.addStructure(id, offset)
        }
        let wallsList = boxData.get("walls")
        for(let i = 0; i < wallsList.length; i++){
            this.setWallBlock(i, String(wallsList[i]))
        }
        let decorationList = boxData.get("decorations")
        for(let i = 0; i < decorationList.length; i++){
            this.addDecoration(String(decorationList[i]))
        }
        this.updateSideUnits()
        return this
    },
    // todo：装饰器
    /**
     * 判断坐标是否在蜂箱范围内,返回在蜂箱范围内的坐标
     * @param {BlockPos[] | BlockPos} blockPos 
     * @returns {[]}
     */
    inBoxBlockList : function(blockPos){
        function checkPos(bbb, targetPos){
            if(targetPos.y < bbb.centerY || targetPos.y > bbb.centerY + bbb.wallHeight){return false}
            for(let i = 0; i < bbb.halfSideLength; i++){
                let enPos = bbb.sideUnits[1][i]
                let esPos = bbb.sideUnits[2][i]
                let wnPos = bbb.sideUnits[4][i]
                let wsPos = bbb.sideUnits[5][i]
                if(targetPos.x <= (enPos.x + 1) && targetPos.x >= wnPos.x && targetPos.z >= enPos.z && targetPos.z <= enPos.z + 1){
                    return true
                }
                if(targetPos.x <= (esPos.x + 1) && targetPos.x >= wsPos.x && targetPos.z >= esPos.z && targetPos.z <= esPos.z + 1){
                    return true
                }
            }
            return false
        }
        let result = []
        if(Array.isArray(blockPos)){
            blockPos.forEach(pos => {
                if(checkPos(this, pos)){
                    result.push(pos) 
                }
            })
        }else{
            if(checkPos(this, blockPos)){
                result.push(blockPos) 
            }
        }
        return result
    }
}

/**
 * 柱子单元
 * @param {Internal.Level} level 
 * @param {*} block 
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 * @param {*} high 
 */
function blockColumnUnit(level, block, x, y, z, high){
    level.server.runCommandSilent(`fill ${x} ${y} ${z} ${x + 1} ${y + high} ${z + 1} ${block}`)
}

