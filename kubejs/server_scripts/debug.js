ItemEvents.rightClicked("kubejs:debugger", event=>{
    let player = event.player
    let level = player.level

    player.tell('§edebug start')

    let bb = new BeeBoxBuilder(level,12, player.x, player.y - 2, player.z)
    // bb.build()
    bb.door(2).door(1).build()
    bb.extend(2).door(2+3).door(0).build()
    bb.extend(0).door(0+3).door(0+3+1).build()
    // bb.extend(1).build()
    // bb.extend(2).build() 
    // bb.extend(3).build()
    // bb.extend(4).build()
    // bb.extend(5).build()
    // bb.extend(1).build()

    // bb.extend(6).build()
    
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