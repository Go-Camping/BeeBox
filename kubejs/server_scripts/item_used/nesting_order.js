ItemEvents.rightClicked("kubejs:nesting_order", event=>{
    // 右键选择建巢方向
    // shift右键使用
    let player = event.player
    let level = player.level
    let item = event.item
    if(!item.getNbt() || item.getNbt().getInt("DoorNum") == null){
        player.tell('§5无效物品')
        return
    }
    let doorNum = item.getNbt().getInt("DoorNum")
    if(!player.isShiftKeyDown()){
        doorNum = (doorNum + 1) % 6
        item.getNbt().putInt("DoorNum", doorNum)
        level.server.runCommandSilent(`title ${player.name.getString()} actionbar {"text":"${Text.translatable("kubejs.status_msg.door_direction." + doorNum).getString()}","color":"yellow"}`)
        return
    }
    // player.tell('§edebug start')
    let playerPos = new BlockPos(player.x, player.y - 2, player.z)
    let boxLength = BeeBoxDefaultSize.boxLength
    let boxHigh = BeeBoxDefaultSize.boxHigh
    let CurrentBoxPos = findCurrentBoxCenter(level, playerPos, boxLength - 1, boxHigh)
    if(CurrentBoxPos == null){
        player.tell(`§5附近没有找到箱子中心`)
        return
    }
    doorNum = item.getNbt().getInt("DoorNum") 
    let findBox = new BeeBoxBuilder(level, CurrentBoxPos)
    let newBox = new BeeBoxBuilder(level, CurrentBoxPos).extend(doorNum)
    if(level.getBlock(newBox.centerX, newBox.centerY, newBox.centerZ).id == "kubejs:beebox_center"){
        player.tell(`§5那里已经有一个蜂箱了`)
        return
    }
    else{
        findBox.buildDoor(doorNum)
        newBox.buildBox().buildDoor(doorNum + 3)
        let damageValue = item.getDamageValue()
        if(damageValue > item.getMaxDamage()){
            item.setCount(0)
        }
        else {
            item.setDamageValue(damageValue + 1)
        }
        player.addItemCooldown("kubejs:nesting_order", 20 * 5)
        player.tell(`§5建筑完成`)
    }
})