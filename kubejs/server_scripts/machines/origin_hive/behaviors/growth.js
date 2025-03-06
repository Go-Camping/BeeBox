/**
 * 
 * @param {fr.frinn.custommachinery.common.integration.kubejs.function_.Context} ctx 
 * @param {number}
 */
function Growth(ctx, frequence){
    if (ctx.block.level.getDayTime() % frequence != 0) return new CustomMachineryData().build()
    let block = ctx.block
    let level = block.level
    let data = ctx.machine.data.get('originHiveData')
    let result = new CustomMachineryData().readNBT(data)
    let honeyStore = ctx.machine.getFluidStored('honey_store').amount
    let growth = ctx.machine.data.getInt('growth')

    if (honeyStore > 0){
        ctx.machine.setFluidStored('honey_store', Fluid.of("forestry:honey", honeyStore - 1))
        ctx.machine.data.putInt('growth', growth + 10)
        result.delInfo('巢群正在挨饿！')
        result.success()
    }
    else{
        if (growth <= 10){
            result.pushInfo('巢群即将饿死！')
        }
        else{
            ctx.machine.data.putInt('growth', growth - 10)
        }
        result.delInfo('巢群即将饿死！')
        result.pushInfo('巢群正在挨饿！')
    }

    ctx.machine.data.put('originHiveData', result.build())
    return result.build()

}