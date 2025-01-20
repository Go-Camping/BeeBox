ItemEvents.tooltip(event => {
    event.addAdvanced("kubejs:shop_order", (item, advanced, text) => {
        let nbt = item.getNbt()
        if (nbt && nbt.get("TradeList")) {
            let tradeList = nbt.get("TradeList")
            for (let i = 0; i < tradeList.length; i++) {
                /**
                 * @type {Internal.CompoundTag} 
                 */
                let trade = tradeList[i]
                let goods = trade.getString("goods")
                let count = trade.getInt("count")
                let cost = trade.getInt("cost")
                let good_nbt = trade.getString("good_nbt")
                let name = Item.of(goods, `${good_nbt}`).getDisplayName()
                Text.green(name).append("§f x" + count + "§f : §e$" + cost)
                if(goods != "minecraft:air"){
                    text.add(name)
                }
                else{
                    text.add(Text.red("§knogoods"))
                }
            }
        }
        else {
            text.add(Text.of("§4§knotrade"))
        }
    })

    event.addAdvanced("kubejs:nesting_order", (item, advanced, text) => {
        let nbt = item.getNbt()
        if (nbt && nbt.getInt("DoorNum") != null) {
            let door = nbt.getInt("DoorNum")
            let direction = "North"
            switch(door % 6){
                case 0:  direction = "North"
                break
                case 1:  direction = "North-East"
                break
                case 2:  direction = "South-East"
                break
                case 3:  direction = "South"
                break
                case 4:  direction = "South-West"
                break
                case 5:  direction = "North-West"
                break
                default: direction = "§c§knorth"
                break
            }
            // let name = Text.of(text.get(0)).append("§e" + direction)
            // text.add(0,  name)
            text.add("当前选择方向: §e" + direction)
        }
        else {
            text.add(Text.of("§c§knorth"))
        }
    })
})