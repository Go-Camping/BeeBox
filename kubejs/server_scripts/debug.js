ItemEvents.rightClicked("kubejs:debugger", event=>{
    let player = event.player
    let level = player.level

    player.tell('§edebug start')
    let playerPos = new BlockPos(player.x, player.y - 2, player.z)

    if(false){
        let bbb = new BeeBoxBuilder(level, playerPos)//.setBoxSize(16, 10)
        bbb.buildBox().door(0).door(1).door(2)
        bbb.extend(0).buildBox().door(0 + 3)
        bbb.extend(1).buildBox().door(1 + 3)
        bbb.extend(2).buildBox().door(2 + 3)

        player.tell(`build box center at [${playerPos.x}, ${playerPos.y}, ${playerPos.z}]`)
    }
    else{
        let goods1 = Item.of('forestry:serum_ge', '{ForgeCaps:{Parent:{analyzed:0b,genome:{"forestry:butterfly_effect":{active:"forestry:butterfly_effect_none",inactive:"forestry:butterfly_effect_none"},"forestry:butterfly_lifespan":{active:"forestry:20id",inactive:"forestry:20id"},"forestry:butterfly_species":{active:"forestry:butterfly_cspeckled_wood",inactive:"forestry:butterfly_cspeckled_wood"},"forestry:cocoon":{active:"forestry:cocoon_default",inactive:"forestry:cocoon_default"},"forestry:fertility":{active:"forestry:2id",inactive:"forestry:2id"},"forestry:fireproof":{active:"forestry:falsed",inactive:"forestry:falsed"},"forestry:flower_type":{active:"forestry:flower_type_vanilla",inactive:"forestry:flower_type_vanilla"},"forestry:humidity_tolerance":{active:"forestry:tolerance_none",inactive:"forestry:tolerance_none"},"forestry:metabolism":{active:"forestry:2i",inactive:"forestry:2i"},"forestry:never_sleeps":{active:"forestry:falsed",inactive:"forestry:falsed"},"forestry:size":{active:"forestry:0.5f",inactive:"forestry:0.5f"},"forestry:speed":{active:"forestry:0.3fd",inactive:"forestry:0.3fd"},"forestry:temperature_tolerance":{active:"forestry:tolerance_none",inactive:"forestry:tolerance_none"},"forestry:tolerates_rain":{active:"forestry:falsed",inactive:"forestry:falsed"}},health:20,max_heath:20}}}')
        let goods2 = Item.of('forestry:bee_drone_ge', '{ForgeCaps:{Parent:{analyzed:0b,genome:{"forestry:activity":{active:"forestry:activity_diurnal",inactive:"forestry:activity_diurnal"},"forestry:bee_effect":{active:"forestry:bee_effect_none",inactive:"forestry:bee_effect_none"},"forestry:bee_species":{active:"forestry:bee_monastic",inactive:"forestry:bee_monastic"},"forestry:cave_dwelling":{active:"forestry:trued",inactive:"forestry:trued"},"forestry:fertility":{active:"forestry:1id",inactive:"forestry:1id"},"forestry:flower_type":{active:"forestry:flower_type_wheat",inactive:"forestry:flower_type_wheat"},"forestry:humidity_tolerance":{active:"forestry:tolerance_both_1d",inactive:"forestry:tolerance_both_1d"},"forestry:lifespan":{active:"forestry:50i",inactive:"forestry:50i"},"forestry:pollination":{active:"forestry:30i",inactive:"forestry:30i"},"forestry:speed":{active:"forestry:0.6fd",inactive:"forestry:0.6fd"},"forestry:temperature_tolerance":{active:"forestry:tolerance_both_1d",inactive:"forestry:tolerance_both_1d"},"forestry:territory":{active:"forestry:9_6_9",inactive:"forestry:9_6_9"},"forestry:tolerates_rain":{active:"forestry:falsed",inactive:"forestry:falsed"}},health:50,max_heath:50,pristine:1b}}}')
        // let shopOrder1 = Item.of('kubejs:shop_order', '{TradeList:[{}]}')
        // /**
        //  * @type {Internal.CompoundTag[]} 
        //  */
        // let tradeList = shopOrder1.getNbt().get("TradeList")
        // tradeList.push(tradeList[0].copy())
        // tradeList[0].putInt("count", 10)
        // tradeList[0].putInt("cost", 10)
        // tradeList[0].putString("goods", goods1.getId())
        // tradeList[0].putString("goods_nbt", goods1.getNbtString())

        // tradeList[1].putInt("count", 1)
        // tradeList[1].putInt("cost", 3)
        // tradeList[1].putString("goods", "stick")
        
        // let shopOrder1 = Item.of('kubejs:shop_order', '{TradeList:[{cost:10,count:10,goods:"stone"},{cost:3,count:1,goods:"stick"},{cost:500,count:12,goods:"diamond"},{cost:250,count:2,goods:"forestry:serum_ge",goods_nbt:\'{ForgeCaps:{Parent:{analyzed:0b,genome:{"forestry:butterfly_effect":{active:"forestry:butterfly_effect_none",inactive:"forestry:butterfly_effect_none"},"forestry:butterfly_lifespan":{active:"forestry:20id",inactive:"forestry:20id"},"forestry:butterfly_species":{active:"forestry:butterfly_blue_duke",inactive:"forestry:butterfly_blue_duke"},"forestry:cocoon":{active:"forestry:cocoon_default",inactive:"forestry:cocoon_default"},"forestry:fertility":{active:"forestry:3i",inactive:"forestry:3i"},"forestry:fireproof":{active:"forestry:falsed",inactive:"forestry:falsed"},"forestry:flower_type":{active:"forestry:flower_type_vanilla",inactive:"forestry:flower_type_vanilla"},"forestry:humidity_tolerance":{active:"forestry:tolerance_none",inactive:"forestry:tolerance_none"},"forestry:metabolism":{active:"forestry:2i",inactive:"forestry:2i"},"forestry:never_sleeps":{active:"forestry:falsed",inactive:"forestry:falsed"},"forestry:size":{active:"forestry:0.5f",inactive:"forestry:0.5f"},"forestry:speed":{active:"forestry:0.3fd",inactive:"forestry:0.3fd"},"forestry:temperature_tolerance":{active:"forestry:tolerance_both_1d",inactive:"forestry:tolerance_both_1d"},"forestry:tolerates_rain":{active:"forestry:falsed",inactive:"forestry:falsed"}},health:20,max_heath:20}}}\'}]}')
        let shopOrder1 = Item.of('kubejs:shop_order', `{TradeList:[{cost:10,count:10,goods:"stone",goods_nbt:"{Unbreakable:1b}"},{cost:3,count:1,goods:"stick"}]}`)
        let shopOrder2 = new ShopOrder().build()
        let shopOrder3 = new ShopOrder().addTrade(goods1, 10).addTrade(goods2, 105).addTrade(Item.of("air"), 0).build()
        let nestingOrder = Item.of('kubejs:nesting_order', '{DoorNum:0}')
        player.give(shopOrder1.withName('交易清单§6 1'))
        player.give(shopOrder2.withName('交易清单§6 2'))
        player.give(shopOrder3.withName('交易清单§6 3'))
        player.give(nestingOrder)
    }

    // player.tell(global.BoxCenterMap.get(closestPos).centerY)

    /*let b = 16
    let r = Math.round((b - 2) * Math.sqrt(3) / 2)
    r = r%2 == 0 ? r : r + 1
    let start = new BlockPos(p.x, p.y, p.z)
    let bs = b
    let rs = 1
    let xs = 0
    for (rs; rs<= r; rs++){
        for (xs; xs<bs; xs++){
            let block = Block.getBlock("kubejs:beehive")
            if (xs <= 1 || xs >= bs - 2 || rs <= 2) {
                block = Block.getBlock("minecraft:honeycomb_block")
            }
            l.setBlock(new BlockPos(start.x + xs, start.y, start.z + rs - 1), block.defaultBlockState(), 2)
            l.setBlock(new BlockPos(start.x + xs, start.y, start.z + (2 * r - rs)), block.defaultBlockState(), 2)
            
        }
        xs = 0
        if (rs % 2 == 0){
            start = new BlockPos(start.x - 1, start.y, start.z)
            bs += 2
        }

    }*/

    player.tell('§edebug end')

})