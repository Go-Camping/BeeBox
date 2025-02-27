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
    let presetId = itemNbt.getString("box_preset")
    let type = itemNbt.getString("box_type")
    let tier = itemNbt.getString("box_tier")
    let thisBox = new BeeBoxBuilder(event.level, centerPos).loadDataFromCenter()
    let newBox
    if(BeeBoxPresets.hasOwnProperty(presetId)){
        newBox = thisBox.extend(wallNum).preset(presetId)
    }else if(global.BeeBoxTypesPool[type]){
        newBox = thisBox.extend(wallNum).presetInRandom(global.BeeBoxTypesPool[type])
    }else if(global.BeeBoxTiersPool[tier]){
        newBox = thisBox.extend(wallNum).presetInRandom(global.BeeBoxTiersPool[tier])
    }else{
        newBox = thisBox.extend(wallNum).preset("default")
    }
    if(newBox.getCenterBlock().id != "kubejs:beebox_center"){
        thisBox.buildDoor(wallNum).saveDataToCenter()
        newBox.setDoor(wallNum + 3, true).buildBox()
        item.setDamageValue(item.getDamageValue() + 2)
    }
    else{
        thisBox.buildDoor(wallNum).saveDataToCenter()
        newBox.buildDoor(wallNum + 3).saveDataToCenter()
        item.setDamageValue(item.getDamageValue() + 1)
    }
    if(item.getDamageValue() >= item.getMaxDamage()){
        item.shrink(1)
    }
})