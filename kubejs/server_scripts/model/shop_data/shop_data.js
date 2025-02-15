/**记录商店售卖物品的数据，一个记录货物信息的列表，与shop_order可以通用
 * 其大致格式为：[{"goods": 售卖的物品, "goods_nbt": 物品nbt, "count": 售卖的数量, "money": 作为货币使用的物品,"money_nbt": 作为货币的物品应具有的nbt（缺省为''，暂不设作用）, "cost": 价格}]
 */

function ShopData(){
    /**@type {Internal.List<Internal.CompoundTag>} */
    this.data = []
}

ShopData.prototype = {
    /**
     * 
     * @param {Internal.ItemStack} shop_order_item 
     */
    readShopOrder: function(shop_order_item){
        /**@type {Internal.List<Internal.CompoundTag>} */
        let tradeList = shop_order_item.nbt.get('TradeList')
        tradeList.forEach(trade =>{
            var oneData = new $CompoundTag()
            oneData.putString('goods', "minecraft:air")
            oneData.put('goods_nbt', '')
            oneData.putInt('count', 1)
            oneData.putString('money', DefaultMoney)
            oneData.put('money_nbt', '')
            oneData.putInt('cost', 1)
            if (trade.contains('goods')) oneData.putString('goods', trade.getString('goods'))
            if (trade.contains('goods_nbt')) oneData.put('goods_nbt', trade.get('goods_nbt'))
            if (trade.contains('count')) oneData.putInt('count', trade.getInt('count'))
            if (trade.contains('cost')) oneData.putInt('cost', trade.getInt('cost'))
            this.data.push(oneData)
        })
        return this
    },
    outputShopOrder: function(){
        let item = Item.of("kubejs:shop_order", 1, {TradeList: []})
        let TradeList = []
        this.data.forEach(data =>{
            var order = new $CompoundTag()
            order.putString('goods', data.getString('goods'))
            order.putInt('cost', data.getInt('cost'))
            order.putInt('count', data.getInt('count'))
            order.put('goods_nbt', data.get('goods_nbt'))
            TradeList.push(order)
        })
        item.nbt.merge({TradeList: TradeList})
        return item
    },
    /**
     * 
     * @param {Internal.List<Internal.CompoundTag>} data 
     */
    setData: function(data){
        console.log(1)
        data.forEach(ele =>{
            var e = new $CompoundTag()
            e.merge(ele)
            this.data.push(e)
        })
        console.log(this.data)
        return this
    }
}



