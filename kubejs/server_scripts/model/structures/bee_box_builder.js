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
    this.structure = []
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
        this.buildFlat(this.wallHeight, this.topBlock, "replace")
        this.buildFlat(0, this.floorBlock, "replace")
        this.fillBiome(this.biome)
        this.buildStructure()
        // 生成墙
        for(let i = 0; i < 6; i++){
            this.buildWall(i)
        }    
        this.buildCenter()
        return this
    },
    /**
     * 根据wall_number对应的墙和当前box中心xyz，生成一个新的BeeBoxBuilder对象
     * @param {number} wall_number 从正北（Z轴负方向）开始，顺时针计算，每个边代表一个方向，依次为从0至5, 若为负数，则代表上或下，-1代表上，-2代表下
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
        this.structure.push({"id": id, "offsetPos": offsetPos})
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
     * 在相对中心位置建造一个模板结构
     * @param {string} id  template id
     * @param {BlockPos} offsetPos  相对坐标，相对于蜂箱中心的偏移量
     * @returns 
     */
    buildStructure : function(){
        this.structure.forEach(template => {
            let id = template.id
            let offsetPos = template.offsetPos
            this.level.server.runCommandSilent(`/place template ${id} ${this.centerX + offsetPos.x} ${this.centerY + offsetPos.y} ${this.centerZ + offsetPos.z}`)
        })
        return this
    },
    buildCenter : function(){
        this.level.getBlock(this.centerX, this.centerY, this.centerZ).set("kubejs:beebox_center")
        this.level.getBlock(this.centerX + 1, this.centerY, this.centerZ).set(this.floorBlock)
        this.level.getBlock(this.centerX, this.centerY, this.centerZ + 1).set(this.floorBlock)
        this.level.getBlock(this.centerX + 1, this.centerY, this.centerZ + 1).set(this.floorBlock)
        return this
    },
    /**
     * 使用BeeBoxTemplate设置蜂巢参数
     * @param {Object} template  BeeBoxTemplate[str]
     */
    template : function(template){
        if(template.biome){
            this.setBiome(template.biome ?? this.biome)
        }
        if(template.structures){
            template.structures.forEach(structure => {
                let id = structure.id
                let offset = structure.offset ?? new BlockPos(0, 1, 0)
                this.addStructure(id, offset)
            })
        }
        if(template.walls){
            for(let i = 0; i < template.walls.length; i++){
                this.setWallBlock(i, template.walls[i])
            }
        }
        if(template.floor){
            this.setFloorBlock(template.floor)
        }
        if(template.top){
            this.setTopBlock(template.top)
        }
        return this
    },
    clone : function(){
        let newBox = new BeeBoxBuilder(this.level, new BlockPos(this.centerX, this.centerY, this.centerZ))
           .setWallBlock(0, this.wallBlock[0])
           .setWallBlock(1, this.wallBlock[1])
           .setWallBlock(2, this.wallBlock[2])
           .setWallBlock(3, this.wallBlock[3])
           .setWallBlock(4, this.wallBlock[4])
           .setWallBlock(5, this.wallBlock[5])
           .setFloorBlock(this.floorBlock)
           .setTopBlock(this.topBlock)
           .setBiome(this.biome)
           .setBoxSize(this.halfSideLength * 2, this.wallHeight + 1)
        newBox.sideUnits = this.sideUnits
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
            this.sideUnits[0][j] = {x: startPos.x + j * 2, y: startPos.y, z: startPos.z}
            this.sideUnits[1][j] = {x: startPos.x + halfLength * 2 + j, y: startPos.y, z: startPos.z + j * 2}
            this.sideUnits[2][j] = {x: startPos.x + halfLength * 3 - 1 - j, y: startPos.y, z: startPos.z + halfLength * 2 + j * 2}
            this.sideUnits[3][j] = {x: startPos.x + (halfLength - 1) * 2 - j * 2, y: startPos.y, z: startPos.z + halfLength * 4 - 2}
            this.sideUnits[4][j] = {x: startPos.x - 2 - j, y: startPos.y, z: startPos.z + halfLength * 4 - 2 - j * 2}
            this.sideUnits[5][j] = {x: startPos.x - halfLength - 1 + j, y: startPos.y, z: startPos.z + halfLength * 2 - j * 2 - 2}
        }
        return this
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

