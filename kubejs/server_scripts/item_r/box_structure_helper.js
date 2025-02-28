ItemEvents.rightClicked("kubejs:box_structure_helper", event => {
    let player = event.player
    let level = player.level
    let playerPos = player.blockPosition()
    let findPos = findCurrentBoxCenter(level, playerPos, BeeBoxDefaultSize.boxLength, BeeBoxDefaultSize.boxHigh)
    if(!findPos){return  player.tell('§e没有找到蜂箱核心')}
    player.tell(`§e中心位于${findPos},处理中..`)
    let bbb = new BeeBoxBuilder(level, findPos)//.setBoxSize(16, 20)
    let boxPosScope = bbb.getBoxPosScope("all")
    let xScope = boxPosScope[0]
    let yScope = boxPosScope[1]
    let zScope = boxPosScope[2]
    bbb.setAllWallBlock("air").buildAllWalls(false)
    .buildFlat(bbb.wallHeight - 1, "minecraft:blue_glazed_terracotta", "replace")
    .buildFlat(1, "minecraft:blue_glazed_terracotta", "replace")
    .buildCenter()
    for(let y = yScope[0]; y <= yScope[1]; y++){
        for(let x = xScope[0]; x <= xScope[1]; x++){
            for(let z = zScope[0]; z <= zScope[1]; z++){
                let result = bbb.findPosInBox(new BlockPos(x, y, z))
                if(result.length > 0){continue}
                let block = level.getBlock(new BlockPos(x, y, z))
                block.set("air")
            }
        }
    }
    let structureCornerPos1 = new BlockPos(xScope[0] + 2, yScope[0] + 2, zScope[0] + 2)
    let structureCornerPos2 = new BlockPos(xScope[1] - 2, yScope[1] - 2, zScope[1] - 2)
    level.getBlock(structureCornerPos1).set("minecraft:magenta_glazed_terracotta")
    level.getBlock(structureCornerPos2).set("minecraft:magenta_glazed_terracotta")
    player.tell(`§e角落1坐标:§3${structureCornerPos1}`)
    player.tell(`§e角落2坐标:§3${structureCornerPos2}`)
    return  player.tell('§e完成')

})