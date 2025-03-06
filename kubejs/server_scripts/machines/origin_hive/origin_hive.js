ServerEvents.recipes(event =>{
    event.recipes.custommachinery.custom_machine('kubejs:origin_hive', 20)
    .requireFunctionEachTick(ctx =>{
        if (!ctx.machine.data.contains('originHiveData')) ctx.machine.data.put('originHiveData', new CustomMachineryData().build())
        if (!ctx.machine.data.contains('growth')) ctx.machine.data.putInt('growth', 250)
        let data = ctx.machine.data.get('originHiveData').get('data')
        if (!data.contains('droneSpeed')) data.putFloat('droneSpeed', 0)
        let additionalSpeed = data.getFloat('droneSpeed')

        Cells(ctx, 20)
        DroneWorks(ctx, 20)
        FindWorks(ctx, 20)
        Digesting(ctx, Math.max(40, 100 - additionalSpeed))
        Growth(ctx, 20)
        Works(ctx, 20)

        if (ctx.block.level.getTime() % 20 == 0){
            let data = ctx.machine.data.get('originHiveData')
            let Info = data.get('data').get('logs')
            Info.forEach(log =>{
                ctx.block.level.tell(log)
            })
            if (data.getBoolean('result')){
                return ctx.success()
            }
            else {
                return ctx.error(`${data.get('data').get('error')}`)
            }
        }
        return ctx.success()

    })
    .requireFunctionToStart(ctx =>{
        let machine = ctx.machine
        let level = ctx.block.level
        let flag = true
        if (machine.data.contains('sleeping') && machine.data.getBoolean('sleeping')) flag = false
        if (machine.getFluidStored('honey_store').amount > 0){
            machine.data.putBoolean('hungry', false)
        }
        else{
            machine.data.putBoolean('hungry', true)
        }
        if (flag) return ctx.success()
        else return ctx.error('')
    })
})


