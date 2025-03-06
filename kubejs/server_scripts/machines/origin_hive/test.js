BlockEvents.rightClicked('kubejs:origin_hive', event =>{
    let data = event.block.entity.serializeNBT()
    let originData = data.get('componentManager').get('data_component').get('originHiveData').get('data')
    if (event.player.crouching){
        event.player.tell(`当前有${originData.get('storeCells').length}个储物巢`)
        event.player.tell(`当前有${originData.get('droneCells').length}个工蜂巢`)
        event.player.tell(`当前有${originData.get('internalCells').length}个内勤蜂巢`)
        event.player.tell(`当前有${originData.get('externalCells').length}个外勤蜂巢`)
        event.player.tell(`当前有${originData.get('drones').length}只工蜂`)
        event.player.tell(`提供${originData.getFloat('droneSpeed')}点加速`)
        event.player.tell(`额外消耗${originData.getInt('droneCost')}点蜂蜜`)

        event.cancel()
    }
})