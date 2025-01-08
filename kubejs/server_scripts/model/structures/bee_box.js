/**
 * 根据中心点和边长生成六边形
 * @param {Internal.Level} level
 * @param {number} length 建议边长取偶数，否则可能影响美观性
 * @param {number} centerx 由于边长取偶数，因此中心位置的x坐标应该为.5
 * @param {number} centery 
 * @param {number} centerz 由于边长取偶数，因此中心位置的z坐标应该为.5
 */

function BeeBox (level, length, centerx, centery, centerz){
    this.level = level
    this.sideLength = length
    //两直边的间距为高，为边长的√3倍，此处为高的一半，为密铺时美观且安全，取偶数
    this.semiHeight = Math.round((this.sideLength - 2) * Math.sqrt(3) / 2)
    this.semiHeight = this.semiHeight % 2 == 0 ? this.semiHeight : this.semiHeight ++
    this.centerx = centerx
    this.centery = centery
    this.centerz = centerz
    this.biome = "minecraft:plains"
    this.wallHeight = 2
    this.float = false
    this.floorBlock = Block.getBlock("kubejs:beehive").defaultBlockState()
    this.wallBlock = Block.getBlock("minecraft:honeycomb_block").defaultBlockState()
    this.floatBlock = Block.getBlock("minecraft:air").defaultBlockState()
    return this
}

BeeBox.prototype = {

    /**
     * @param {number} direction 从正北（Z轴负方向）开始，顺时针计算，每个边代表一个方向，依次为从1至6
     */
    extend : function(direction){
        switch(direction){
            case 1 :
                this.centerz -= this.semiHeight * 2
                break
            case 2 :
                this.centerz -= this.semiHeight
                this.centerx += this.semiHeight / 2 + this.sideLength - 1
                break
            case 3 :
                this.centerz += this.semiHeight
                this.centerx += this.semiHeight / 2 + this.sideLength - 1
                break
            case 4 :
                this.centerz += this.semiHeight * 2
                break
            case 5 :
                this.centerz += this.semiHeight
                this.centerx -= this.semiHeight / 2 + this.sideLength - 1
                break
            case 6 :
                this.centerz -= this.semiHeight
                this.centerx -= this.semiHeight / 2 + this.sideLength - 1
                break
            default :
                this.centerz -= this.semiHeight * 2
                break
        }
        return this
    },
    build : function (){
        let start = new BlockPos(this.centerx - this.sideLength / 2 - 0.5, this.centery, this.centerz - this.semiHeight - 0.5)
        //直边沿x方向展开
        let xBlocks = this.sideLength
        let zBlkocks = this.semiHeight
        let x = 0
        let y = 0
        let z = 1
        let level = this.level
        for (z; z<= zBlkocks; z++){
            for (x; x<xBlocks; x++){
                let block = this.floorBlock
                if (x <= 1 || x >= xBlocks - 2 || z <= 2) {
                    //建墙/勾边
                    block = this.wallBlock
                    for (y; y <= this.wallHeight; y++){
                        level.setBlock(new BlockPos(start.x + x, start.y + y, start.z + z - 1), block, 2)
                        level.setBlock(new BlockPos(start.x + x, start.y + y, start.z + (2 * this.semiHeight - z)), block, 2)
                        fillBiome(level, start.x + x, start.z + z - 1, this.biome)
                        fillBiome(level, start.x + x, start.z + (2 * this.semiHeight - z), this.biome)
                    }
                    y = 0

                }
                level.setBlock(new BlockPos(start.x + x, start.y, start.z + z - 1), block, 2)
                level.setBlock(new BlockPos(start.x + x, start.y, start.z + (2 * this.semiHeight - z)), block, 2)
                fillBiome(level, start.x + x, start.z + z - 1, this.biome)
                fillBiome(level, start.x + x, start.z + (2 * this.semiHeight - z), this.biome)
                
            }
            x = 0
            //斜边斜率为2（√3）
            if (z % 2 == 0){
                start = new BlockPos(start.x - 1, start.y, start.z)
                xBlocks += 2
            }
    
        }

    }
}

/**
 * 用于填充一条竖线上的群系
 * @param {Internal.Level} level
 * @param {number} x 
 * @param {number} z 
 * @param {string} biome 
 */
function fillBiome(level, x, z, biome){
    level.server.runCommandSilent(`fillbiome ${x} ${-40} ${z} ${x} ${255} ${z} ${biome}`)
}
