ServerEvents.recipes(event => {
    event.recipes.custommachinery.custom_machine("kubejs:bee_shop2", 20 * 10).resetOnError()
        .requireFunctionEachTick(ctx => {
            let machine = ctx.machine
            let pdata = ctx.tile.persistentData
            let itemInput = machine.getItemStored("input_slot_1")

            // Only for debug
            let debugButtonState = machine.data.getBoolean("debug")
            if(debugButtonState) { 
                machine.getOwner().tell("§edebug: ") 
                pdata.putInt("my_data", 777)
                // machine.data.putInt("my_data", 666)
                let my_data = pdata.getInt("my_data")
                // machine.data.getInt("my_data")
                machine.getOwner().tell(`§edebug: my_data=${my_data}`)
                machine.data.putBoolean("debug", false)
            }

            // 检测菜单
            if (itemInput.id == "kubejs:shop_order") {
                let orderNbt = itemInput.getNbt()
                if(!orderNbt || !orderNbt.get("TradeList")){
                    return ctx.error("no trade list")
                }
                let tradeList = orderNbt.get("TradeList")

                // 售卖物品展示
                for(let i = tradeList.length; i < 10; i++){
                    machine.setItemStored("goods_slot_" + i, "minecraft:air")
                }
                for(let i = 0; i < tradeList.length; i++){
                    let trade = tradeList[i]
                    let goods = trade.getString("goods")
                    let count = trade.getInt("count")
                    let cost = trade.getInt("cost")
                    let goods_nbt = trade.getString("goods_nbt")
                    machine.setItemStored("goods_slot_" + i, Item.of(goods, `${goods_nbt}`).withCount(count))
                }

                // 购买按纽
                for(let i = 0; i < tradeList.length; i++){
                    let trade = tradeList[i]
                    let buttonState = machine.data.getBoolean("goods_button_" + i)
                    if(buttonState){
                        let goods = machine.getItemStored("goods_slot_" + i)
                        machine.addItemToSlot("output_slot_" + i, goods, false)
                        machine.data.putBoolean("goods_button_" + i, false)
                    }
                }
                return ctx.success()
            }

            // 没有菜单时商品栏清空
            // todo:
            for(let i = 0; i < 10; i++){
                machine.setItemStored("goods_slot_" + i, "minecraft:air")
            }
            return ctx.error("no item")
        })
        .requireFunctionToStart(ctx => {
            let machine = ctx.machine
            let data = ctx.tile.persistentData
            let itemInput = machine.getItemStored("input_slot_1")
            if (itemInput.id == "kubejs:shop_order") {
                let orderNbt = itemInput.getNbt()
                if(!orderNbt || !orderNbt.get("TradeList")){
                    return ctx.error("no trade list")
                }
                return ctx.success()
            }
            return ctx.error("no item")
        })
        .requireFunctionOnEnd(ctx => {
            return ctx.success()
        })
        .gui(new shopRunningPage()
            .addGui(new shopSlotGui("output_slot_0", 30, 30))
            .addGui(new shopSlotGui("output_slot_1", 50, 30))
            .addGui(new shopSlotGui("output_slot_2", 70, 30))
            .addGui(new shopSlotGui("output_slot_3", 90, 30))
            .addGui(new shopSlotGui("output_slot_4", 110, 30))
            .addGui(new shopSlotGui("output_slot_5", 130, 30))
            .addGui(new shopSlotGui("output_slot_6", 150, 30))
            .addGui(new shopSlotGui("output_slot_7", 170, 30))
            .addGui(new shopSlotGui("output_slot_8", 190, 30))
            .addGui(new shopSlotGui("output_slot_9", 210, 30))
            .addGui(new shopSlotGui("goods_slot_0", 30, 10))
            .addGui(new shopSlotGui("goods_slot_1", 50, 10))
            .addGui(new shopSlotGui("goods_slot_2", 70, 10))
            .addGui(new shopSlotGui("goods_slot_3", 90, 10))
            .addGui(new shopSlotGui("goods_slot_4", 110, 10))
            .addGui(new shopSlotGui("goods_slot_5", 130, 10))
            .addGui(new shopSlotGui("goods_slot_6", 150, 10))
            .addGui(new shopSlotGui("goods_slot_7", 170, 10))
            .addGui(new shopSlotGui("goods_slot_8", 190, 10))
            .addGui(new shopSlotGui("goods_slot_9", 210, 10))
            .addGui(new shopButtonGui("goods_button_0", 30 - 1, 10 - 1))
            .addGui(new shopButtonGui("goods_button_1", 50 - 1, 10 - 1))
            .addGui(new shopButtonGui("goods_button_2", 70 - 1, 10 - 1))
            .addGui(new shopButtonGui("goods_button_3", 90 - 1, 10 - 1))
            .addGui(new shopButtonGui("goods_button_4", 110 - 1, 10 - 1))
            .addGui(new shopButtonGui("goods_button_5", 130 - 1, 10 - 1))
            .addGui(new shopButtonGui("goods_button_6", 150 - 1, 10 - 1))
            .addGui(new shopButtonGui("goods_button_7", 170 - 1, 10 - 1))
            .addGui(new shopButtonGui("goods_button_8", 190 - 1, 10 - 1))
            .addGui(new shopButtonGui("goods_button_9", 210 - 1, 10 - 1))
            .buildGui()
        )
})