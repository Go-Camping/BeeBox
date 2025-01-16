function BeeBoxBuilder (level, length, centerX, centerY, centerZ){
    this.level = level
    this.halfSideLength = Math.round(length / 2)
    this.centerX = Math.round(centerX)
    this.centerY = Math.round(centerY)
    this.centerZ = Math.round(centerZ)
    this.biome = "minecraft:cold_ocean"
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
    this.sideUnit = []
    this.initSideUnit()
}

BeeBoxBuilder.prototype = {
    /**
     * 调用前先确保this.sidePos已经初始化
     * @returns 
     */
    build: function(){
        // 生成墙
        for(let i = 0; i < 6; i++){
            for(let j = 0; j < this.halfSideLength; j++){
                let pos = this.sideUnit[i][j]
                blockColumn(this.level, pos.block, pos.x, pos.y, pos.z, this.wallHeight)
            }
        }        
        // 生成地面、封顶和生物群系
        let currentStartPos
        let currentEndPos
        let floorY = this.centerY
        let floatY = this.centerY + this.wallHeight
        for(let i = 0; i < this.halfSideLength; i++){
            currentStartPos = this.sideUnit[1][i]  
            currentEndPos = this.sideUnit[4][i]
            this.level.server.runCommandSilent(`fill ${currentStartPos.x + 1} ${floorY} ${currentStartPos.z} ${currentEndPos.x} ${floorY} ${currentStartPos.z + 1} ${this.floorBlock} keep`)
            this.level.server.runCommandSilent(`fill ${currentStartPos.x + 1} ${floatY} ${currentStartPos.z} ${currentEndPos.x} ${floatY} ${currentStartPos.z + 1} ${this.floatBlock} keep`)
            this.level.server.runCommandSilent(`fillbiome ${currentStartPos.x} ${floorY} ${currentStartPos.z} ${currentEndPos.x} ${floatY} ${currentStartPos.z + 1} ${this.biome}`)

            currentStartPos = this.sideUnit[2][i]
            currentEndPos = this.sideUnit[5][i]
            this.level.server.runCommandSilent(`fill ${currentStartPos.x + 1} ${floorY} ${currentStartPos.z} ${currentEndPos.x} ${floorY} ${currentStartPos.z + 1} ${this.floorBlock} keep`)
            this.level.server.runCommandSilent(`fill ${currentStartPos.x + 1} ${floatY} ${currentStartPos.z} ${currentEndPos.x} ${floatY} ${currentStartPos.z + 1} ${this.floatBlock} keep`)
            this.level.server.runCommandSilent(`fillbiome ${currentStartPos.x} ${floorY} ${currentStartPos.z} ${currentEndPos.x} ${floatY} ${currentStartPos.z + 1} ${this.biome}`)
        }
        return
    },
    /**
     * 根据wall_number改变中心xyz，并调用一次initSidePos()重新计算六边形蜂巢的柱子单元坐标
     * @param {number} wall_number 从正北（Z轴负方向）开始，顺时针计算，每个边代表一个方向，依次为从1至6
     * @returns 
     */
    extend : function(wall_number){
        switch(wall_number % 6){
            case 0 :
                this.centerZ -= this.halfSideLength * 4
                break
            case 1 :
                this.centerZ -= this.halfSideLength * 2
                this.centerX +=  (this.halfSideLength + 1) * 3 
                break
            case 2 :
                this.centerZ += this.halfSideLength * 2
                this.centerX += (this.halfSideLength + 1) * 3 
                break
            case 3 :
                this.centerZ += this.halfSideLength * 4
                break
            case 4 :
                this.centerZ += this.halfSideLength * 2
                this.centerX -= (this.halfSideLength + 1) * 3 
                break
            case 5 :
                this.centerZ -= this.halfSideLength * 2
                this.centerX -= (this.halfSideLength + 1) * 3 
                break
            default :
                this.centerZ -= this.halfSideLength * 4
                break
        }
        this.initSideUnit()
        return this
    },
    setWallBlock : function(wall_number, block){
        this.wallBlock[wall_number % 6] = block
        return this
    },
    door : function(wall_number){
        let blockColumn = this.sideUnit[wall_number % 6]
        for(let i = 1; i < this.halfSideLength - 1; i++){
            blockColumn[i].block = "air"
        }
        return this
    },
    /**
     * 标记用于组成六边形蜂巢的柱子单元坐标;
     * 
     * sidePos[墙编号0 ~ 5][柱子编号0 ~ halfSideLength-1] = {x: number, y: number, z: number}
     */
    initSideUnit : function(){
        let startPos = new BlockPos(this.centerX - this.halfSideLength, this.centerY, this.centerZ - this.halfSideLength * 2)
        let halfSideLength = this.halfSideLength
        this.sidePos = [[]]
        for(let i = 0; i < 6; i++){
            this.sideUnit[i] = []
        }
        for(let i = 0; i < halfSideLength; i++){
            this.sideUnit[0][i] = {x: startPos.x + i * 2, y: startPos.y, z: startPos.z, block: this.wallBlock[0]}
            this.sideUnit[1][i] = {x: startPos.x + halfSideLength * 2 + i, y: startPos.y, z: startPos.z + i * 2, block: this.wallBlock[1]}
            this.sideUnit[2][i] = {x: startPos.x + halfSideLength * 3 - 1 - i, y: startPos.y, z: startPos.z + halfSideLength * 2 + i * 2, block: this.wallBlock[2]}
            this.sideUnit[3][i] = {x: startPos.x + (halfSideLength - 1) * 2 - i * 2, y: startPos.y, z: startPos.z + halfSideLength * 4 - 2, block: this.wallBlock[3]}
            this.sideUnit[4][i] = {x: startPos.x - 2 - i, y: startPos.y, z: startPos.z + halfSideLength * 4 - 2 - i * 2, block: this.wallBlock[4]}
            this.sideUnit[5][i] = {x: startPos.x - halfSideLength - 1 + i, y: startPos.y, z: startPos.z + halfSideLength * 2 - i * 2 - 2, block: this.wallBlock[5]}
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
function blockColumn(level, block, x, y, z, high){
    level.server.runCommandSilent(`fill ${x} ${y} ${z} ${x + 1} ${y + high} ${z + 1} ${block}`)
}

