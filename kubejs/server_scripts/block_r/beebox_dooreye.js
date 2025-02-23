BlockEvents.rightClicked("kubejs:beebox_dooreye", event => {
    let item = event.item
    let itemNbt = event.item.getNbt()
    let block = event.block
    if(item.id != "kubejs:nesting_order") {
        event.cancel()
        return
    }
    let wallData = block.getEntityData().getCompound("componentManager").getCompound("data_component").getCompound("WallData")
    if(!wallData || !itemNbt){
        event.cancel()
        return
    }
    let centerPos = new BlockPos(wallData.getInt("box_center_x"), wallData.getInt("box_center_y"), wallData.getInt("box_center_z"))
    let wallNum = wallData.getInt("wall_number")
    let presets = itemNbt.getString("box_preset")
    let tier = itemNbt.getString("box_tier")
    let thisBox = new BeeBoxBuilder(event.level, centerPos)
    let newBox
    if(Object.keys(BeeBoxPresets)[presets]){
        newBox = thisBox.extend(wallNum).preset(presets)
    }else if(tier){
        newBox = thisBox.extend(wallNum).presetInRandom(Object.keys(global.BeeBoxTiers[tier]))
    }else{
        newBox = thisBox.extend(wallNum).preset("default")
    }
    if(newBox.getCenterBlock().id != "kubejs:beebox_center"){
        thisBox.buildDoor(wallNum)
        newBox.buildBox().buildDoor(wallNum + 3)
        item.setDamageValue(item.getDamageValue() + 2)
    }
    else{
        thisBox.buildDoor(wallNum)
        newBox.buildDoor(wallNum + 3)
        item.setDamageValue(item.getDamageValue() + 1)
    }
    if(item.getDamageValue() >= item.getMaxDamage()){
        item.shrink(1)
    }
})