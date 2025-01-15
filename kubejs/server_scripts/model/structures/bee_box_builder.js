function BeeBoxBuilder (level, length, centerX, centerY, centerZ){
    this.level = level
    this.halfSideLength = Math.round(length / 2)
    this.centerX = centerX
    this.centerY = centerY
    this.centerZ = centerZ
    this.biome = "minecraft:cold_ocean"
    this.wallHeight = 8
    this.floorBlock = "kubejs:beehive"
    this.wallBlock = "minecraft:honeycomb_block"
    this.floatBlock = 'minecraft:yellow_stained_glass'
}

BeeBoxBuilder.prototype = {
    build: function(){
        let start = new BlockPos(this.centerX - this.halfSideLength + 0.5, this.centerY, this.centerZ - this.halfSideLength * 2 + 0.5)
        let halfLength = this.halfSideLength
        let sidePos = [[]]
        for(let i = 0; i < 6; i++){
            sidePos[i] = []
        }
        for(let i = 0; i < halfLength; i++){
            sidePos[0][i] = {x: start.x + i * 2, y: start.y, z: start.z}
            sidePos[1][i] = {x: start.x + halfLength * 2 + i, y: start.y, z: start.z + i * 2}
            sidePos[2][i] = {x: start.x + halfLength * 3 - 1 - i, y: start.y, z: start.z + halfLength * 2 + i * 2}
            sidePos[3][i] = {x: start.x + (halfLength - 1) * 2 - i * 2, y: start.y, z: start.z + halfLength * 4 - 2}
            sidePos[4][i] = {x: start.x - 2 - i, y: start.y, z: start.z + halfLength * 4 - 2 - i * 2}
            sidePos[5][i] = {x: start.x - halfLength - 1 + i, y: start.y, z: start.z + halfLength * 2 - i * 2 - 2}
        }
        // 生成墙
        for(let i = 0; i < 6; i++){
            for(let j = 0; j < halfLength; j++){
                let posX = sidePos[i][j].x
                let posY = sidePos[i][j].y
                let posZ = sidePos[i][j].z
                blockColumn(this.level, this.wallBlock, posX, posY, posZ, this.wallHeight)
            }
        }        
        // 生成地面和封顶
        let currentStartPos
        let currentEndPos
        let floorY = this.centerY
        let floatY = this.centerY + this.wallHeight
        for(let i = 0; i < halfLength; i++){
            currentStartPos = sidePos[1][i]  
            currentEndPos = sidePos[4][i]
            this.level.server.runCommandSilent(`fill ${currentStartPos.x} ${floorY} ${currentStartPos.z} ${currentEndPos.x} ${floorY} ${currentStartPos.z + 1} ${this.floorBlock} keep`)
            this.level.server.runCommandSilent(`fill ${currentStartPos.x} ${floatY} ${currentStartPos.z} ${currentEndPos.x} ${floatY} ${currentStartPos.z + 1} ${this.floatBlock} keep`)
            this.level.server.runCommandSilent(`fillbiome ${currentStartPos.x} ${floorY} ${currentStartPos.z} ${currentEndPos.x} ${floatY} ${currentStartPos.z + 1} ${this.biome}`)

            currentStartPos = sidePos[2][i]
            currentEndPos = sidePos[5][i]
            this.level.server.runCommandSilent(`fill ${currentStartPos.x} ${floorY} ${currentStartPos.z} ${currentEndPos.x} ${floorY} ${currentStartPos.z + 1} ${this.floorBlock} keep`)
            this.level.server.runCommandSilent(`fill ${currentStartPos.x} ${floatY} ${currentStartPos.z} ${currentEndPos.x} ${floatY} ${currentStartPos.z + 1} ${this.floatBlock} keep`)
            this.level.server.runCommandSilent(`fillbiome ${currentStartPos.x} ${floorY} ${currentStartPos.z} ${currentEndPos.x} ${floatY} ${currentStartPos.z + 1} ${this.biome}`)
        }

        return
    },
    /**
     * 
     * @param {number} wall_number 从正北（Z轴负方向）开始，顺时针计算，每个边代表一个方向，依次为从1至6
     * @returns 
     */
    extend : function(wall_number){
        switch(wall_number){
            case 1 :
                this.centerZ -= this.halfSideLength * 4
                break
            case 2 :
                this.centerZ -= this.halfSideLength * 2
                this.centerX +=  (this.halfSideLength + 1) * 3 
                break
            case 3 :
                this.centerZ += this.halfSideLength * 2
                this.centerX += (this.halfSideLength + 1) * 3 
                break
            case 4 :
                this.centerZ += this.halfSideLength * 4
                break
            case 5 :
                this.centerZ += this.halfSideLength * 2
                this.centerX -= (this.halfSideLength + 1) * 3 
                break
            case 6 :
                this.centerZ -= this.halfSideLength * 2
                this.centerX -= (this.halfSideLength + 1) * 3 
                break
            default :
                this.centerZ -= this.halfSideLength * 4
                break
        }
        return this
    }
}

/**
 * 
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