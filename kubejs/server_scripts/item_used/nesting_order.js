ItemEvents.rightClicked("kubejs:nesting_order", event=>{
    let player = event.player
    let level = player.level
    let item = event.item

    player.tell('§edebug start')
    let playerPos = new BlockPos(player.x, player.y - 2, player.z)
    let boxLength = 12
    let boxHigh = 8
    let CurrentBoxPos = findCurrentBoxCenter(level, playerPos, boxLength, boxHigh)
    if(CurrentBoxPos == null){
        player.tell(`no find box center`)
        return
    }
    player.tell(`find box center at [${CurrentBoxPos.x}, ${CurrentBoxPos.y}, ${CurrentBoxPos.z}]`)
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
        let damageValue = item.getDamageValue()
        item.setDamageValue(damageValue + 1)
    }
    player.tell('§edebug end')
    // give @a kubejs:nesting_order{DoorNum:0}
})