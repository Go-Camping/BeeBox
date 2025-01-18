/**
 * 用于构建一个蜂巢
 * @param {Internal.Level} level 
 * @param {number} length 
 * @param {Internal.BlockPos} centerPos Internal.BlockPos
 */
function BeeBoxBuilder (level, length, centerPos){
    this.id = convertToBeeBoxBuilderId(centerPos.x, centerPos.y, centerPos.z)
    this.level = level
    this.halfSideLength = Math.round(length / 2)
    // 该中心点不是几何中心点，只是以该中心点为基点生成六边形蜂巢
    this.centerX = centerPos.x
    this.centerY = centerPos.y
    this.centerZ = centerPos.z
    this.biome = "minecraft:cold_ocean"
    // 墙的高度至少为2
    this.wallHeight = 8
    this.floorBlock = "kubejs:beehive"
    this.wallBlock = [
        "minecraft:stone",
        "minecraft:blue_ice",
        "minecraft:oak_log",
        "minecraft:honeycomb_block",
        "minecraft:smooth_red_sandstone",
        "minecraft:prismarine"
    ]
    this.floatBlock = 'minecraft:yellow_stained_glass'
    this.sideUnits = []
    this.initSideUnits()
}

BeeBoxBuilder.prototype = {
    /**
     * 生成六边形蜂巢
     * @returns 
     */
    buildBox: function(){
        // 生成墙
        for(let i = 0; i < 6; i++){
            this.buildWall(i)
        }        
        // 生成地面、封顶和生物群系
        let currentStartPos
        let currentEndPos
        let floorY = this.centerY
        let floatY = this.centerY + this.wallHeight
        for(let i = 0; i < this.halfSideLength; i++){
            currentStartPos = this.sideUnits[1][i]  
            currentEndPos = this.sideUnits[4][i]
            this.level.server.runCommandSilent(`fill ${currentStartPos.x + 1} ${floorY} ${currentStartPos.z} ${currentEndPos.x} ${floorY} ${currentStartPos.z + 1} ${this.floorBlock} keep`)
            this.level.server.runCommandSilent(`fill ${currentStartPos.x + 1} ${floatY} ${currentStartPos.z} ${currentEndPos.x} ${floatY} ${currentStartPos.z + 1} ${this.floatBlock} keep`)
            this.level.server.runCommandSilent(`fillbiome ${currentStartPos.x + 1} ${floorY} ${currentStartPos.z} ${currentEndPos.x} ${floatY} ${currentStartPos.z + 1} ${this.biome}`)

            currentStartPos = this.sideUnits[2][i]
            currentEndPos = this.sideUnits[5][i]
            this.level.server.runCommandSilent(`fill ${currentStartPos.x + 1} ${floorY} ${currentStartPos.z} ${currentEndPos.x} ${floorY} ${currentStartPos.z + 1} ${this.floorBlock} keep`)
            this.level.server.runCommandSilent(`fill ${currentStartPos.x + 1} ${floatY} ${currentStartPos.z} ${currentEndPos.x} ${floatY} ${currentStartPos.z + 1} ${this.floatBlock} keep`)
            this.level.server.runCommandSilent(`fillbiome ${currentStartPos.x + 1} ${floorY} ${currentStartPos.z} ${currentEndPos.x} ${floatY} ${currentStartPos.z + 1} ${this.biome}`)
        }
        this.level.getBlock(this.centerX, this.centerY, this.centerZ).set("kubejs:beebox_center")
        return
    },
    /**
     * 根据wall_number和当前box中心xyz，生成一个新的BeeBoxBuilder对象
     * @param {number} wall_number 从正北（Z轴负方向）开始，顺时针计算，每个边代表一个方向，依次为从0至5
     * @returns 新的BeeBoxBuilder对象
     */
    extend : function(wall_number){
        if(wall_number < 0) return this
        let newX = this.centerX
        let newY = this.centerY
        let newZ = this.centerZ
        switch(wall_number % 6){
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
            default :
                newZ = this.centerZ - this.halfSideLength * 4
                break
        }
        return new BeeBoxBuilder(this.level, this.halfSideLength * 2, new BlockPos(newX, newY, newZ))
    },
    setWallBlock : function(wall_number, block){
        if(wall_number < 0) return this
        this.wallBlock[wall_number % 6] = block
        return this
    },
    /**
     * 生成墙上的门，在墙上掏个洞
     * @param {number} wall_number 
     * @returns 
     */
    door : function(wall_number){
        if(wall_number < 0) return this
        let blockColumn = this.sideUnits[wall_number % 6]
        for(let i = 1; i < this.halfSideLength - 1; i++){
            blockColumn[i].block = "air"
        }

        for(let i = 1; i < this.halfSideLength - 1; i++){
            let unit = blockColumn[i]
            blockColumnUnit(this.level, unit.block, unit.x, unit.y + 1, unit.z, this.wallHeight - 2)
        }
        return this
    },
    buildWall : function(wall_number){
        if(wall_number < 0) return this
        for(let j = 0; j < this.halfSideLength; j++){
            let unit = this.sideUnits[wall_number % 6][j]
            blockColumnUnit(this.level, unit.block, unit.x, unit.y, unit.z, this.wallHeight)
        }
        return this
    },
    clone : function(){
        return new BeeBoxBuilder(this.level, this.halfSideLength * 2, new BlockPos(this.centerX, this.centerY, this.centerZ))
    },
    /**
     * 标记用于组成六边形蜂巢的柱子单元坐标;
     * 
     * sideUnits[墙编号0 ~ 5][柱子编号0 ~ halfSideLength-1] = {x: number, y: number, z: number, block: string}
     */
    initSideUnits : function(){
        let startPos = new BlockPos(this.centerX - this.halfSideLength, this.centerY, this.centerZ - this.halfSideLength * 2)
        let halfSideLength = this.halfSideLength
        for(let i = 0; i < 6; i++){
            this.sideUnits[i] = []
        }
        for(let i = 0; i < halfSideLength; i++){
            this.sideUnits[0][i] = {x: startPos.x + i * 2, y: startPos.y, z: startPos.z, block: this.wallBlock[0]}
            this.sideUnits[1][i] = {x: startPos.x + halfSideLength * 2 + i, y: startPos.y, z: startPos.z + i * 2, block: this.wallBlock[1]}
            this.sideUnits[2][i] = {x: startPos.x + halfSideLength * 3 - 1 - i, y: startPos.y, z: startPos.z + halfSideLength * 2 + i * 2, block: this.wallBlock[2]}
            this.sideUnits[3][i] = {x: startPos.x + (halfSideLength - 1) * 2 - i * 2, y: startPos.y, z: startPos.z + halfSideLength * 4 - 2, block: this.wallBlock[3]}
            this.sideUnits[4][i] = {x: startPos.x - 2 - i, y: startPos.y, z: startPos.z + halfSideLength * 4 - 2 - i * 2, block: this.wallBlock[4]}
            this.sideUnits[5][i] = {x: startPos.x - halfSideLength - 1 + i, y: startPos.y, z: startPos.z + halfSideLength * 2 - i * 2 - 2, block: this.wallBlock[5]}
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

