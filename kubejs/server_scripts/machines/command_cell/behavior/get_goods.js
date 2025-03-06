/**
 * 
 * @param {fr.frinn.custommachinery.common.integration.kubejs.function_.Context} ctx 
 * @param {number}
 */
function GetGoods(ctx, frequence){
    if (ctx.block.level.getDayTime() % frequence != 0) return new CustomMachineryData().build()
    let block = ctx.block
    let level = block.level
    let data = ctx.block.entity.persistentData.get('commandCellData')
    let result = new CustomMachineryData().readNBT(data)
    if (!result.data.contains('goods')) return result.build()
    if (!ctx.machine.data.contains('reflash')) return result.build()
    if (!ctx.machine.data.get('reflash')) return result.build()

    let tradeData = data.get('goods')

    let machine = ctx.machine
    for (var i = 0; i < 3; i++){
        var index = Math.round(Math.random() * (tradeData.length - 1))
        var trade = new $CompoundTag().merge(tradeData[index])
        var goods = trade.getString('goods')
        var goods_nbt = trade.get('goods_nbt')
        var money = trade.getString('money')
        var money_nbt = trade.get('money_nbt')
        var randomNum = Math.round(Math.random() * 3) + 1
        var count = trade.getInt('count') * randomNum
        var cost = trade.getInt('cost') * randomNum
        machine.setItemStored(`goods_slot_${i + 1}`, Item.of(goods, count, goods_nbt))
        machine.setItemStored(`money_slot_${i + 1}`, Item.of(money, cost, money_nbt))
    } 

    result.success()
    ctx.machine.data.putBoolean('goods', false)
    return result.build()

}