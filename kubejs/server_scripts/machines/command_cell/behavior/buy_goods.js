/**
 * 
 * @param {fr.frinn.custommachinery.common.integration.kubejs.function_.Context} ctx 
 * @param {number}
 */
function BuyGoods(ctx, frequence){
    if (ctx.block.level.getDayTime() % frequence != 0) return new CustomMachineryData().build()
    let block = ctx.block
    let level = block.level
    let data = ctx.block.entity.persistentData.get('commandCellData')
    let result = new CustomMachineryData().readNBT(data)
    if (ctx.machine.data.get('gd1')){
        let machine = ctx.machine
        let pay = machine.getItemStored('input_slot_1')
        let price = machine.getItemStored('money_slot_1')
        if (pay.id == price.id && pay.count >= price.count){
    
            machine.setItemStored('output_slot_0', machine.getItemStored('goods_slot_1').copy())
            machine.setItemStored('input_slot_1', Item.of(pay, pay.count - price.count))
            ctx.machine.data.putBoolean('gd1', false)
        }
        level.tell('蜂蜜不足！')
    }
    if (ctx.machine.data.get('gd2')){
        let machine = ctx.machine
        let pay = machine.getItemStored('input_slot_1')
        let price = machine.getItemStored('money_slot_2')
        if (pay.id == price.id && pay.count >= price.count){
    
            machine.setItemStored('output_slot_0', machine.getItemStored('goods_slot_2').copy())
            machine.setItemStored('input_slot_1', Item.of(pay, pay.count - price.count))
            ctx.machine.data.putBoolean('gd2', false)
        }
        level.tell('蜂蜜不足！')
    }
    if (ctx.machine.data.get('gd1')){
        let machine = ctx.machine
        let pay = machine.getItemStored('input_slot_1')
        let price = machine.getItemStored('money_slot_3')
        if (pay.id == price.id && pay.count >= price.count){
    
            machine.setItemStored('output_slot_0', machine.getItemStored('goods_slot_3').copy())
            machine.setItemStored('input_slot_1', Item.of(pay, pay.count - price.count))
            ctx.machine.data.putBoolean('gd3', false)
        }
        level.tell('蜂蜜不足！')
    }

    result.success()
    return result.build()
}