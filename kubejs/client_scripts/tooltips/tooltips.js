const $CompoundTag = Java.loadClass('net.minecraft.nbt.CompoundTag')
ItemEvents.tooltip(event => {
    event.addAdvanced("kubejs:shop_order", (item, advanced, text) => {
        let order = new ShopOrder(item)
        for (let i = 0; i < order.tradeList.length; i++) {
            let trade = order.getTrade(i)
            let tip = Item.of(trade.getString('goods'), trade.get('goods_nbt')).getDisplayName()
            Text.green(tip).append("§f x" + trade.count + "§f : §e$" + trade.cost)
            if(trade.goods != "minecraft:air"){
                text.add(tip)
            }
            else{
                text.add(Text.red("§knogoods"))
            }           
        }
    })

    event.addAdvanced("kubejs:nesting_order", (item, advanced, text) => {
        let nbt = item.getNbt()
        if (nbt && nbt.getInt("DoorNum") != null) {
            let door = nbt.getInt("DoorNum")
            let direction = Text.translatable("kubejs.status_msg.door_direction." + door).getString()
            text.add("当前选择方向: §e" + direction)
        }
        else {
            text.add(Text.of("§c§knorth"))
        }
    })
})