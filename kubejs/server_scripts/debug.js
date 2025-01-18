ItemEvents.rightClicked("kubejs:debugger", event=>{
    let player = event.player
    let level = player.level

    player.tell('§edebug start')
    let playerPos = new BlockPos(player.x, player.y - 2, player.z)

    if(false){
        let bbb = new BeeBoxBuilder(level, 12, playerPos)
        bbb.buildBox()
        bbb.extend(0).buildBox()
        bbb.extend(2).buildBox()

        player.tell(`build box center at [${playerPos.x}, ${playerPos.y}, ${playerPos.z}]`)
    }
    else{
        // let closestPos = `${pos.x}_${pos.y}_${pos.z}`
        // let distant = -1
        // global.BoxCenterMap.forEach((/** @type {BeeBoxBuilder} */ value, key) => {
        //     let x = value.centerX
        //     let y = value.centerY
        //     let z = value.centerZ
        //     let dist = Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2) + Math.pow(z - pos.z, 2)
        //     if(dist < distant || distant == -1){
        //         distant = dist
        //         closestPos = `${x}_${y}_${z}`
        //     }
        // })
        // let findBox = global.BoxCenterMap.get(closestPos)
        let boxLength = 12
        let boxHigh = 8
        let CurrentBoxPos = findCurrentBoxCenter(level, playerPos, boxLength, boxHigh)
        if(CurrentBoxPos == null){
            player.tell(`no find box center`)
            return
        }
        player.tell(`find box center at [${CurrentBoxPos.x}, ${CurrentBoxPos.y}, ${CurrentBoxPos.z}]`)
        let item = player.getMainHandItem()
        let doorNum = 0
        if(!item.getNbt() || item.getNbt().getInt("DoorNum") == null){
            player.tell('§5no DoorNum in item')
            player.tell('§edebug end')
            return
        }
        doorNum = item.getNbt().getInt("DoorNum") 
        let findBox = new BeeBoxBuilder(level, boxLength, CurrentBoxPos)
        let newBox = new BeeBoxBuilder(level, boxLength, CurrentBoxPos).extend(doorNum)
        if(level.getBlock(newBox.centerX, newBox.centerY, newBox.centerZ).id == "kubejs:beebox_center"){
            player.tell(`§5box already exist`)
            player.tell('§edebug end')
            return
        }
        else{
            findBox.door(doorNum)
            newBox.buildBox()
            newBox.door(doorNum + 3)
            player.tell(`§5build finish`)
        }
        // give @a kubejs:nesting_order{DoorNum:0}
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