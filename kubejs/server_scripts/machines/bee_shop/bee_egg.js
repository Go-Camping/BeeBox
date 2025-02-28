ServerEvents.recipes(event => {
    event.recipes.custommachinery.custom_machine("kubejs:bee_egg", 1)
    .requireFunctionToStart(ctx =>{
        let data = ctx.block.entity.persistentData
        if (data.contains('shop_data')) return ctx.error('done')
        data.put('shop_data', bee_drone_ge_unit_price)
        let machine = ctx.machine
        for (var i = 0; i < 3; i++){
            var index = Math.round(Math.random() * (bee_drone_ge_unit_price.length - 1))
            var trade = new $CompoundTag().merge(bee_drone_ge_unit_price[index])
            var goods = trade.getString('goods')
            var goods_nbt = trade.get('goods_nbt')
            var money = trade.getString('money')
            var money_nbt = trade.get('money_nbt')
            var randomNum = Math.round(Math.random() * 3) + 1
            var count = trade.getInt('count') * randomNum
            var cost = trade.getInt('cost') * randomNum
            machine.setItemStored(`goods_slot_${i + 1}`, Item.of(goods, count).withNBT(goods_nbt))
            machine.setItemStored(`money_slot_${i + 1}`, Item.of(money, cost).withNBT(money_nbt))
        }
        return ctx.success()
    })

    event.recipes.custommachinery.custom_machine("kubejs:bee_egg", 1)
    .requireFunctionOnStart(ctx =>{
        let data = ctx.block.entity.persistentData
        if (!data.contains('shop_data')) return ctx.error()
        /**@type {Internal.List<string>} */
        let tradeData = data.get('shop_data')
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
        return ctx.success()
    })
    .requireButtonPressed('reflash')

    event.recipes.custommachinery.custom_machine("kubejs:bee_egg", 20)
    .requireFunctionToStart(ctx =>{
        let machine = ctx.machine
        let pay = machine.getItemStored('input_slot_1')
        let price = machine.getItemStored('money_slot_1')
        if (pay.id == price.id && pay.count >= price.count){

            machine.setItemStored('output_slot_0', machine.getItemStored('goods_slot_1').copy())
            machine.setItemStored('input_slot_1', Item.of(pay, pay.count - price.count))
            return ctx.success()
        }
        else return ctx.error('穷逼滚开')
    })
    .requireButtonPressed('gd1')

    event.recipes.custommachinery.custom_machine("kubejs:bee_egg", 20)
    .requireFunctionToStart(ctx =>{
        let machine = ctx.machine
        let pay = machine.getItemStored('input_slot_1')
        let price = machine.getItemStored('money_slot_2')
        if (pay.id == price.id && pay.count >= price.count){
            machine.setItemStored('output_slot_0', machine.getItemStored('goods_slot_2').copy())
            machine.setItemStored('input_slot_1', Item.of(pay, pay.count - price.count))
            return ctx.success()
        }
        else return ctx.error('穷逼滚开')
    })
    .requireButtonPressed('gd2')

    event.recipes.custommachinery.custom_machine("kubejs:bee_egg", 20)
    .requireFunctionToStart(ctx =>{
        let machine = ctx.machine
        let pay = machine.getItemStored('input_slot_1')
        let price = machine.getItemStored('money_slot_3')
        if (pay.id == price.id && pay.count >= price.count){
            machine.setItemStored('output_slot_0', machine.getItemStored('goods_slot_3').copy())
            machine.setItemStored('input_slot_1', Item.of(pay, pay.count - price.count))
            return ctx.success()
        }
        else return ctx.error('穷逼滚开')
    })
    .requireButtonPressed('gd3')


})

// Item.of('forestry:butterfly_ge', '{ForgeCaps:{Parent:{analyzed:0b,genome:{"forestry:butterfly_effect":{active:"forestry:butterfly_effect_none",inactive:"forestry:butterfly_effect_none"},"forestry:butterfly_lifespan":{active:"forestry:20id",inactive:"forestry:20id"},"forestry:butterfly_species":{active:"forestry:butterfly_blue_duke",inactive:"forestry:butterfly_blue_duke"},"forestry:cocoon":{active:"forestry:cocoon_default",inactive:"forestry:cocoon_default"},"forestry:fertility":{active:"forestry:3i",inactive:"forestry:3i"},"forestry:fireproof":{active:"forestry:falsed",inactive:"forestry:falsed"},"forestry:flower_type":{active:"forestry:flower_type_vanilla",inactive:"forestry:flower_type_vanilla"},"forestry:humidity_tolerance":{active:"forestry:tolerance_none",inactive:"forestry:tolerance_none"},"forestry:metabolism":{active:"forestry:2i",inactive:"forestry:2i"},"forestry:never_sleeps":{active:"forestry:falsed",inactive:"forestry:falsed"},"forestry:size":{active:"forestry:0.5f",inactive:"forestry:0.5f"},"forestry:speed":{active:"forestry:0.3fd",inactive:"forestry:0.3fd"},"forestry:temperature_tolerance":{active:"forestry:tolerance_both_1d",inactive:"forestry:tolerance_both_1d"},"forestry:tolerates_rain":{active:"forestry:falsed",inactive:"forestry:falsed"}},health:20,max_heath:20}}}')