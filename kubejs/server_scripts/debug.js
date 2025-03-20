ItemEvents.rightClicked("kubejs:debugger", event=>{
    let player = event.player
    let level = player.level

    player.tell('§edebug start')
    let playerPos = player.blockPosition()
    let buildPos = playerPos.offset(0, -3, 0)
    // let T = new GrowthTree(level, playerPos.offset(0, -1, 0)).loadDataFromRoot()

    if(player.isShiftKeyDown()){
        // $HexChunkGenerator.placedHex($Hex.blockToHex(buildPos.x, buildPos.z, BeeBoxDefaultSize.boxLength),state, 0)
        // level.tell(level.getBlock(playerPos.offset(0, -1, 0)).blockState.getValues())
        level.tell(level.getBlock(playerPos.offset(0, -1, 0)))
        level.getBlock(playerPos.offset(0, -1, 0)).set("minecraft:spruce_log",{"axis": "z"})//.blockState.setValue(BlockProperties.AXIS, "y")
        
        // level.tell('§2' + $Hex.blockToHex(buildPos.x, buildPos.z, BeeBoxDefaultSize.boxLength).toString())
        // new $PlacedHex()
    }
    else{
        // let order = getNestingOrderItem("preset", "natural_box_2")
        // let order2 = getNestingOrderItem("type_pool", "natural")
        // let order3 = getNestingOrderItem("tier_pool", "T0")
        // player.give(order.withName("1"))
        // player.give(order2.withName("2"))
        // player.give(order3.withName("3"))
        let block = player.rayTrace(20).block
        if(block && block.id == "kubejs:zenith_clouds_log_root"){
            let T = new GrowthTree(level, block.pos).loadDataFromRoot()
            // 需要根周围除上下方的4个面有泥土才能生长
            T.setMaxTreeAge(225)
            T.growUp(222)
        }
        // player.tell(block.tags.toString())
    }
    /*let b = 16
    let r = Math.round((b - 2) * Math.sqrt(3) / 2)
    r = r%2 == 0 ? r : r + 1
    let start = new BlockPos(p.x, p.y, p.z)
    let bs = b
    let rs = 1
    let xs = 0
    for (rs; rs<= r; rs++){
        for (xs; xs<bs; xs++){
            let block = Block.getBlock("kubejs:beehive")
            if (xs <= 1 || xs >= bs - 2 || rs <= 2) {
                block = Block.getBlock("minecraft:honeycomb_block")
            }
            l.setBlock(new BlockPos(start.x + xs, start.y, start.z + rs - 1), block.defaultBlockState(), 2)
            l.setBlock(new BlockPos(start.x + xs, start.y, start.z + (2 * r - rs)), block.defaultBlockState(), 2)
            
        }
        xs = 0
        if (rs % 2 == 0){
            start = new BlockPos(start.x - 1, start.y, start.z)
            bs += 2
        }

    }*/

    player.tell('§edebug end')

})