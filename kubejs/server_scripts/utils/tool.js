/**
 * 使用指令为背包内物品注册价格
 * 方法有：
 * /beebox price_register 玩家名（注册该玩家背包内的物品） 基础单价（单价，背包内有多个物品会自动乘以数量） 价格浮动范围（单价在基础价格基础上正负波动） boolean（决定是否连同nbt一起注册） 文件名（会自动保存至kubejs/server_scripts/utils/price_data文件夹下的该文件名下，并自动注册为常量）
 * /beebox shop_order 玩家名 文件名（只能使用上面命令注册的文件名，直接得到一张对应的商店清单）
 * /beebox clear_data 文件名（删除注册过的数据，若为ALL，则删除所有）
 */
ServerEvents.commandRegistry(event=>{
    const { commands: Commands, arguments: Arguments } = event
    event.register(
        Commands.literal('beebox')
        .requires(src=> src.hasPermission(2))
        .then(Commands.literal('price_register')
        .then(Commands.argument('player', Arguments.PLAYER.create(event))
        .then(Commands.argument('base_price', Arguments.FLOAT.create(event))
        .then(Commands.argument('offset', Arguments.FLOAT.create(event))
        .then(Commands.argument('goods_nbt', Arguments.BOOLEAN.create(event))
        .then(Commands.argument('file_name', Arguments.STRING.create(event))
        .executes(ctx =>{
            let player = ctx.source.server.getPlayer(Arguments.PLAYER.getResult(ctx, 'player'))
            player.tell('正在批量注册背包物品价格,结束之前请勿操作！')
            let base_price = Math.max(Arguments.FLOAT.getResult(ctx, 'base_price'), 0)
            let offset = Arguments.FLOAT.getResult(ctx, 'offset')
            let goods_nbt = Arguments.BOOLEAN.getResult(ctx, 'goods_nbt')
            let file_name = Arguments.STRING.getResult(ctx, 'file_name')
            let items = player.inventory.allItems
            let price_list = []
            items.forEach(item=>{
                price_list.push(`'${CostRegister(item, goods_nbt, DefaultMoney, new $CompoundTag(), item.count, base_price, offset)}'`)
            })
            player.server.persistentData.put(file_name, items.map(item => {return CostRegister(item, goods_nbt, DefaultMoney, new $CompoundTag(), item.count, base_price, offset)}))
            if (!player.server.persistentData.contains('files')) player.server.persistentData.put('files', [])
            let files = player.server.persistentData.get('files')
            files.push(file_name)
            player.server.persistentData.put('files', files)
            let data = price_list.join(', ')
            FilesJS.saveScript(`kubejs/server_scripts/utils/price_data/${file_name}`, `const ${file_name} = [ ${data} ]`)
            player.tell('背包物品价格注册完毕！')
            player.level.runCommand('/kubejs reload server_scripts')
            return 1
        })
    )))))))

    event.register(Commands.literal('beebox')
    .requires(src => src.hasPermission(2))
    .then(Commands.literal('shop_order')
    .then(Commands.argument('player', Arguments.PLAYER.create(event))
    .then(Commands.argument('file_name', Arguments.STRING.create(event))
    .executes(ctx => {
        let player = ctx.source.server.getPlayer(Arguments.PLAYER.getResult(ctx, 'player'))
        let file_name = Arguments.STRING.getResult(ctx, 'file_name')
        let data = player.server.persistentData.get(file_name)
        let item = new ShopData().setData(data).outputShopOrder()
        player.give(item)
        return 1
        })
    ))))

    event.register(Commands.literal('beebox')
    .requires(src => src.hasPermission(2))
    .then(Commands.literal('clear_data')
    .then(Commands.argument('file_name', Arguments.STRING.create(event))
    .executes(ctx => {
        let file_name = Arguments.STRING.getResult(ctx, 'file_name')
        if (!ctx.source.server.persistentData.contains('files')) ctx.source.server.persistentData.put('files', [])
        let files = ctx.source.server.persistentData.get('files')
        if (file_name != 'ALL'){
            ctx.source.server.persistentData.remove(file_name)
            files = files.filter(file => {return file != file_name})
            ctx.source.server.persistentData.put('files', files)
            FilesJS.delete(`kubejs/server_scripts/utils/price_data/${file_name}.js`)
            return 1
        }
        else {
            files.forEach(file =>{
                file_name = JSON.parse(file)
                FilesJS.delete(`kubejs/server_scripts/utils/price_data/${file_name}.js`)
            })
        }
        ctx.source.server.persistentData.put('files', [])
        return 1
        })
    )))
})

/**
 * 
 * @param {Internal.ItemStack} item 要注册价格的物品
 * @param {boolean} itemNBT 是否连同nbt一同注册
 * @param {string} money 货币，目前建议在常量中定义
 * @param {Internal.CompoundTag} moneyNBT 货币需要具有的nbt，缺省为new $CompoundTag()
 * @param {number} count 数量
 * @param {number} perCost 单价
 * @param {number} offset 价格波动
 * @param {string}
 */
function CostRegister(item, itemNBT, money, moneyNBT, count, perCost, offset){
    let data = new $CompoundTag()
    data.putString('goods', item.id)
    data.putString('money', money)
    data.put('money_nbt', moneyNBT)
    itemNBT = itemNBT && item.hasNBT()
    itemNBT = itemNBT ? item.nbt : new $CompoundTag()
    data.put('goods_nbt', itemNBT)
    data.putInt('count', count)
    perCost = Math.max(perCost + (Math.random() - 0.5) * offset * 2, 0)
    data.putInt('cost', perCost * count)
    return data
}






