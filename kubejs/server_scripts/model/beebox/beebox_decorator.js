/**
 * 蜂箱装饰器
 * 
 * 第二个参数为一个NBTCompoundTag对象，用于接收装饰器参数，具体参数请参考具体装饰器的说明。
 * 
 * 调用 BeeBoxBuilder 中的 addDecorator 方法添加装饰器时，若第二个参数为空，则自动调用装饰器的默认参数。
 * @constant
 * @type {Object<string,function(BeeBoxBuilder, Internal.CompoundTag):void}
 */
const BeeBoxDecorator = {
    /**
     * 随机雕刻顶部方块，将其替换为【args中的方块】，一次最多32个,默认为16个屏障
     * @param args :{"block_weight_data_list":{"block_id" : weight, "block_id" : weight ...}, "amount": number}
     */
    "dress_top_by_blocks" : function(bbb, args){
        let blockList = ["minecraft:barrier"]
        let amount = 16
        if(!args.isEmpty()){
            blockList = []
            amount = args.getInt("amount") ?? amount
            let blockListData = args.getCompound("block_weight_data_list")
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
            let result = bbb.findPosInBox([pos], false)
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
    },
    /**
     * 
     * @param args :{start_pos: {x: number, y: number, z: number}, block_id: string,}
     */
    "flat_growing_branches": function(bbb, args){
        let startPos = bbb.getCenterBlock().getPos()
        let blockId = "minecraft:oak_log"
        if(!args.isEmpty()){
            let posTag = args.getCompound("start_pos")
            startPos = NBT2Pos(posTag)
            blockId = args.getString("block_id")
        }
        /**
         * 
         * @param {BlockPos} startPos 
         * @param {function(BlockPos):boolean} isVaild 
         */
        function getAroundVaildPos(startPos, isVaild){
            let result = []
            let pos = []
            pos[0] = startPos.offset(1, 0, 0)
            pos[1] = startPos.offset(-1, 0, 0)
            pos[2] = startPos.offset(0, 0, 1)
            pos[3] = startPos.offset(0, 0, -1)
            pos.forEach(pos => {
                if(isVaild(pos)){
                    result.push(pos)
                }
            })
            return result
        }
        let x1Pos = startPos.offset(1, 0, 0)
        let x2Pos = startPos.offset(-1, 0, 0)
        let z1Pos = startPos.offset(0, 0, 1)
        let z2Pos = startPos.offset(0, 0, -1)
        bbb.buildBlock(x1Pos, blockId)
        bbb.buildBlock(x2Pos, blockId)
        bbb.buildBlock(z1Pos, blockId)
        bbb.buildBlock(z2Pos, blockId)
        // 每个分枝最长为boxLength * 2
        for(let l = 0; l < bbb.getBoxSize()[0] * 2; l++){
            // x正轴方向
            let xNextPos1 = randomInList(getAroundVaildPos(x1Pos, pos => {
                let block = bbb.level.getBlock(pos)
                return pos.x >= x1Pos.x && block.getId() != blockId
            }))
            x1Pos = xNextPos1 ?? x1Pos//.offset(1, 0, 0)
            // x负轴方向
            let XnextPos2 = randomInList(getAroundVaildPos(x2Pos, pos => {
                let block = bbb.level.getBlock(pos)
                return pos.x <= x2Pos.x && block.getId() != blockId
            }))
            x2Pos = XnextPos2 ?? x2Pos//.offset(-1, 0, 0)
            // z正轴方向
            let zNextPos1 = randomInList(getAroundVaildPos(z1Pos, pos => {
                let block = bbb.level.getBlock(pos)
                return pos.z >= z1Pos.z && block.getId() != blockId
            }))
            z1Pos = zNextPos1 ?? z1Pos//.offset(0, 0, 1)
            // z负轴方向
            let zNextPos2 = randomInList(getAroundVaildPos(z2Pos, pos => {
                let block = bbb.level.getBlock(pos)
                return pos.z <= z2Pos.z && block.getId() != blockId
            }))
            z2Pos = zNextPos2 ?? z2Pos//.offset(0, 0, -1)

            bbb.buildBlock(x1Pos, blockId, false)
            bbb.buildBlock(x2Pos, blockId, false)
            bbb.buildBlock(z1Pos, blockId, false)
            bbb.buildBlock(z2Pos, blockId, false)
        }
    },
}

