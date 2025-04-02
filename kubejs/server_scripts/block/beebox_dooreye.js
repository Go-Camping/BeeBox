/**
 * 在右击时，如果右键的物品是"nesting_order"，则尝试获取物品的NBT数据"box_preset"，并以此尝试生成一个新的蜂巢。
 */
BlockEvents.rightClicked("kubejs:beebox_dooreye", event => {
    let item = event.item
    let itemNbt = event.item.getNbt()
    let block = event.block
    if(item.id != "kubejs:nesting_order") {
        event.cancel()
        return
    }
    let wallData = block.getEntityData().getCompound("data").getCompound("WallData")
    if(!wallData || !itemNbt){
        event.cancel()
        return
    }
    let centerPos = new BlockPos(wallData.getInt("box_center_x"), wallData.getInt("box_center_y"), wallData.getInt("box_center_z"))
    let wallNum = wallData.getInt("wall_number")

    let presetId = itemNbt.getString("box_preset")
    let thisBox = new BeeBoxBuilder(event.level, centerPos).loadDataFromCenter()
    let newBox = thisBox.extend(wallNum).preset("default")
    if(BeeBoxPresets.hasOwnProperty(presetId)){
        newBox = thisBox.extend(wallNum).preset(presetId)
    }
    if(newBox.getCenterBlock().id != "kubejs:beebox_center"){
        // console.log("wall:" + wallNum)
        let newWallNum = wallNum < 0 ? (wallNum == -1 ? -2 : -1) : wallNum + 3
        thisBox.buildDoor(wallNum).buildCenter()
        newBox.setDoor(newWallNum, true).buildBox()
        item.setDamageValue(item.getDamageValue() + 2)
    }
    else{
        let newWallNum = wallNum < 0 ? (wallNum == -1 ? wallNum : -2) : wallNum + 3
        thisBox.buildDoor(wallNum).saveDataToCenter()
        newBox.buildDoor(newWallNum).saveDataToCenter()
        item.setDamageValue(item.getDamageValue() + 1)
    }
    if(item.getDamageValue() >= item.getMaxDamage()){
        item.shrink(1)
    }
})