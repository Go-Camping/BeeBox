/**
 * 蜂箱装饰器
 * @constant
 * @type {Object<string,function(BeeBoxBuilder, Internal.CompoundTag):void}
 */
const BeeBoxDecorator = {
    /**
     * 随机雕刻顶部方块，将其替换为【args中的方块】，一次最多32个,默认为16个屏障
     * @param args :{"block_id" : weight, "block_id" : weight ...}
     */
    "dress_top_by_blocks" : function(bbb, args){
        let blockList = ["minecraft:barrier"]
        let amount = 16
        if(!args.isEmpty()){
            blockList = []
            amount = args.getInt("amount") ?? amount
            let blockListData = args.getCompound("block_list_data")
            let blockListKeys = blockListData.getAllKeys()
            blockListKeys.forEach(blockId => {
                let weight = blockListData.getInt(blockId)
                for(let i = 0; i < weight; i++){
                    blockList.push(blockId)
                }
            })
        }
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
     * @param args :{"block_id" : weight, "block_id" : weight ...}
     */
    "hourglass" : function(bbb, args){
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
            "minecraft:dirt",
            "minecraft:dirt",
            "minecraft:dirt",
            "minecraft:dirt",
        ]
        if(!args.isEmpty()){
            blockList = []
            let blockWeightDataList = args.getCompound("block_weight_data_list")
            let blockListKeys = blockWeightDataList.getAllKeys()
            blockListKeys.forEach(blockId => {
                let weight = blockWeightDataList.getInt(blockId)
                for(let i = 0; i < weight; i++){
                    blockList.push(blockId)
                }
            })
        }
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
    }
}

