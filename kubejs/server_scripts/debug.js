ItemEvents.rightClicked("kubejs:debugger", event=>{
    let p = event.player
    let l = p.level

    p.tell('b')

    // let a = new BeeBox(l, 16, Math.round(p.x) + 0.5, Math.round(p.y - 2), Math.round(p.z) + 0.5)
    // a.build()
    // p.tell("0: "+a.centerx+" "+a.centery+" "+a.centerz)
    // a.extend(1).build()
    // p.tell("1: "+a.centerx+" "+a.centery+" "+a.centerz)
    // a.extend(2).build()
    // p.tell("2: "+a.centerx+" "+a.centery+" "+a.centerz)
    // a.extend(3).build()
    // p.tell("3: "+a.centerx+" "+a.centery+" "+a.centerz)
    // a.extend(4).build()
    // p.tell("4: "+a.centerx+" "+a.centery+" "+a.centerz)
    // a.extend(5).build()
    // p.tell("5: "+a.centerx+" "+a.centery+" "+a.centerz)
    // a.extend(1).build()
    // p.tell("6: "+a.centerx+" "+a.centery+" "+a.centerz)

    let bb = new BeeBoxBuilder(l,16, Math.round(p.x) + 0.5, Math.round(p.y - 2), Math.round(p.z) + 0.5)
    bb.build()
    bb.extend(1).build()
    bb.extend(2).build()
    bb.extend(3).build()
    bb.extend(4).build()
    bb.extend(5).build()
    bb.extend(1).build()

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

    p.tell('f')

})