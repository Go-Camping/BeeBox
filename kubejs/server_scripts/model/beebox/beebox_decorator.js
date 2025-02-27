/**
 * 蜂箱装饰器
 * @constant
 * @type {Object<string,function(BeeBoxBuilder):void}
 */
const BeeBoxDecorator = {
    /**
     * 随机雕刻顶部方块，将其替换为【屏障】，一次最多10个
     * @param {BeeBoxBuilder} bbb 
     */
    "dress_top_by_blocks" : function(bbb){
        let blockList = ["minecraft:barrier"]
        let amount = 10
        let offetY = bbb.wallHeight
        let boxBorderX1 = bbb.sideUnits[5][0].x
        let boxBorderX2 = bbb.sideUnits[2][0].x + 1
        let boxBorderZ1 = bbb.sideUnits[0][0].z
        let boxBorderZ2 = bbb.sideUnits[3][0].z + 1
        for(let i = 0; i < amount; i++){
            let x = Math.random() * (boxBorderX2 - boxBorderX1) + boxBorderX1
            let y = bbb.centerY + offetY
            let z = Math.random() * (boxBorderZ2 - boxBorderZ1) + boxBorderZ1
            let pos = new BlockPos(x,y,z)
            let result = bbb.findPosInBox([pos])
            if(result.length > 0){
                let random = Math.floor(Math.random() * (blockList.length - 1))
                bbb.level.getBlock(pos).set(blockList[random])
                bbb.level.getBlock(pos.offset(0,-1,0)).set(blockList[random])
            }else{
                amount = amount >= 32 ? amount : amount + 1
            }
        }
    },
    /**
     * 蜂箱内生成一个沙漏状的装饰柱
     * @param {BeeBoxBuilder} bbb 
     */
    "hourglass" : function(bbb){
        let blockList = [
            "minecraft:air",
            "minecraft:air",
            "minecraft:stone",
            "minecraft:stone",
            "minecraft:stone",
            "minecraft:stone",
            "minecraft:stone",
            "minecraft:stone",
            "minecraft:stone",
            "minecraft:stone",
            "minecraft:stone",
            "minecraft:stone",
            "minecraft:stone",
            "minecraft:dirt",
            "minecraft:dirt",
            "minecraft:dirt",
            "minecraft:dirt",
            "minecraft:sandstone",
            "minecraft:sandstone",
            "minecraft:sand",
            "minecraft:tuff",
            "minecraft:tuff",
            "minecraft:deepslate_iron_ore"
        ]
        const bL = bbb.getBoxSize()[0]
        const bH = bbb.getBoxSize()[1]
        for(let i = 0; i < bbb.wallHeight / 2; i++){
            let offsetY1 = bH - 2 - i
            let offsetY2 = 2 + i
            let muteBox = bbb.clone()
            if(bL > 4){
                muteBox.setBoxSize(bL - 2 * i, bH)
                muteBox.getFlatBlocks(offsetY1).forEach(block => {
                    block.set(randomInList(blockList))
                })
                muteBox.getFlatBlocks(offsetY2).forEach(block => {
                    block.set(randomInList(blockList))
                })
            }
        }
        bbb.buildAllWalls()
        bbb.buildAllDoors()
    }
}

