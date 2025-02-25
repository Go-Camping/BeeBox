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
        if (nbt && nbt.getString("presets") != null) {
            let presets = nbt.getString("presets")
            let direction = Text.translatable("§f预设：§3" + presets).getString()
            text.add( direction)
        }
        else {
            text.add(Text.of("§c§knorth"))
        }
    })

    event.addAdvanced("kubejs:box_structure_helper", (item, advanced, text) => {
        text.add("§3右键以寻找附近的蜂箱核心，在此生成一个结构")
        text.add("§3该结构剔除了蜂箱内部以外的方块，方便圈选结构")
        text.add("§3在框选结构范围的两个对角各生成一个方块")
        text.add("§3范围内有大量水的话需要将gamerule waterSourceConversion设为false")
    })
})