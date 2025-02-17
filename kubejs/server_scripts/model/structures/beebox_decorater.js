const BeeBoxDecorater = {
    /**
     * 随机雕刻顶部方块，将其替换为【黄绿色染色玻璃】，一次最多10个
     * @param {BeeBoxBuilder} bbb 
     * @param {*} block 
     */
    "dress_top_by_block" : function(bbb){
        let amount = 10
        let block = "minecraft:lime_stained_glass"
        let posList = []
        let boxBorderX1 = bbb.sideUnits[5][0].x
        let boxBorderX2 = bbb.sideUnits[2][0].x + 1
        let boxBorderZ1 = bbb.sideUnits[0][0].z
        let boxBorderZ2 = bbb.sideUnits[3][0].z + 1
        for(let i = 0; i < amount; i++){
            let x = Math.random() * (boxBorderX2 - boxBorderX1) + boxBorderX1
            let y = bbb.centerY + bbb.wallHeight
            let z = Math.random() * (boxBorderZ2 - boxBorderZ1) + boxBorderZ1
            posList.push(new BlockPos(x,y,z))
        }
        bbb.inBoxBlockList(posList).forEach(pos => {
            bbb.level.getBlock(pos).set(block)
        })
    }

}