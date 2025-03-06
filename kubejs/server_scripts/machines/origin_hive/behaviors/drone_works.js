/**
 * 
 * @param {fr.frinn.custommachinery.common.integration.kubejs.function_.Context} ctx 
 * @param {number}
 */
function DroneWorks(ctx, frequence){
    if (ctx.block.level.getDayTime() % frequence != 0) return new CustomMachineryData().build()
    let block = ctx.block
    let level = block.level
    let data = ctx.machine.data.get('originHiveData')
    let result = new CustomMachineryData().readNBT(data)
    if (!result.data.contains('droneSpeed')) result.data.putFloat('droneSpeed', 0)
    if (!result.data.contains('droneCost')) result.data.putInt('droneCost', 0)
    let honeyStore = ctx.machine.getFluidStored('honey_store').amount

    let drones = []

    for (var i = 1; i <= 9; i++){
        let drone = ctx.machine.getItemStored(`drone_cell_${i}`)
        if (drone.id == "forestry:bee_drone_ge" && drone.hasNBT()){
            let handler = new BeeNBT().readNBT(drone.nbt)
            let health = handler.getHealth() - 1
            if (health <= 0){
                ctx.machine.removeItemFromSlot(`drone_cell_${i}`, 1, false)
            }
            else{
                handler.setHealth(health)
                drone.setNbt(handler.build())
                drones.push(drone.nbt)
            }
        }
    }

    let droneSpeed = 0
    let droneCost = 0

    drones.forEach(drone =>{
        let handler = new BeeNBT().readNBT(drone)
        droneSpeed += handler.getSpeed()[0]
        droneCost += handler.getFertility()[0]
    })

    if (honeyStore <= 0){
        result.data.putFloat('droneSpeed', 0)
        result.data.putInt('droneCost', droneCost)
        result.data.put('drones', drones)
        result.success()
        ctx.machine.data.put('originHiveData', result.build())
        result.pushInfo('蜂蜜不足，工蜂已停止工作！')
        return result.build()
    }

    ctx.machine.setFluidStored('honey_store', Fluid.of("forestry:honey", honeyStore - droneCost))

    result.delInfo('蜂蜜不足，工蜂已停止工作！')



    if (result.data.getFloat('droneSpeed') == droneSpeed && result.data.getInt('droneCost') == droneCost) return result.build()

    result.data.putFloat('droneSpeed', droneSpeed)
    result.data.putInt('droneCost', droneCost)
    result.data.put('drones', drones)
    result.success()
    ctx.machine.data.put('originHiveData', result.build())
    return result.build()
}