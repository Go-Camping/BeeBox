ItemEvents.rightClicked("kubejs:debugger", event=>{
    let player = event.player
    let level = player.level

    player.tell('§edebug start')
    let playerPos = player.blockPosition()
    let buildPos = playerPos.offset(0, -3, 0)

    if(player.isShiftKeyDown()){
        let decoratorArgs = new $CompoundTag()
        decoratorArgs.put("block_weight_data_list", NBT.compoundTag())
        let blockListData = decoratorArgs.getCompound("block_weight_data_list")
        blockListData.putInt("stone", 25)
        let bbb = new BeeBoxBuilder(level, buildPos)
        // .setBoxSize(18,22)
        // .preset("swamp_box_1")
        // .preset("start_box")
        // .setAllWallBlock("stone")
        // .setTopBlock("minecraft:end_stone")
        // .addDecorator("hourglass", decoratorArgs)
        // .preset("warm_ocean_box_1")
        .preset("natural_box_1")
        .buildFlat(2, "minecraft:grass_block")
        .buildBox()
        // .buildDecorators()
        player.tell(`build box center at [${buildPos.x}, ${buildPos.y}, ${buildPos.z}]`)
        player.tell(`Size: [${bbb.getBoxSize().toString()}]`)
    }
    else{
        let order = getNestingOrderItem("preset", "natural_box_1")
        let order2 = getNestingOrderItem("type_pool", "natural")
        let order3 = getNestingOrderItem("tier_pool", "T0")
        player.give(order.withName("1"))
        player.give(order2.withName("2"))
        player.give(order3.withName("3"))
        // let str = order2.nbt.getString("box_tier")
        // player.tell(String(str).length)
    }
    // player.tell(global.BoxCenterMap.get(closestPos).centerY)

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