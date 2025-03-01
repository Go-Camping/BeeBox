function ShopOrder(orderItem){
    orderItem = orderItem || Item.of('kubejs:shop_order', '{TradeList:[{"goods":"minecraft:air"}]}')
    this.item = Item.of('kubejs:shop_order', '{TradeList:[{"goods":"minecraft:air"}]}')
    /**
     * @type {Internal.CompoundTag[]} 
     */
    this.tradeList = this.item.getNbt().get("TradeList")
    this.setWithItem(orderItem)
}
ShopOrder.prototype = {
    /**
     * 添加交易
     * @param {Internal.ItemStack} itemStack 商品
     * @param {number} cost 售价
     * @returns 
     */
    addTrade : function(itemStack, cost) {
        if(this.tradeList[0].getString("goods") != "minecraft:air"){
            this.tradeList.push(this.tradeList[0].copy())
        }
        this.tradeList[this.tradeList.length - 1].putInt("count", itemStack.getCount())
        this.tradeList[this.tradeList.length - 1].putInt("cost", cost)
        this.tradeList[this.tradeList.length - 1].putString("goods", itemStack.getId())
        this.tradeList[this.tradeList.length - 1].put("goods_nbt", itemStack.hasNBT() ? itemStack.nbt : new $CompoundTag())  //尽量别把NBT当文本存储，可能出问题
        return this
    },
    getTrade : function(index) {
        //建议这样定义tag，直接用中括号定义可能出问题
        let trade = new $CompoundTag()
        trade.putString('goods', this.tradeList[index].getString("goods"))
        trade.putInt('count', this.tradeList[index].getInt("count"))
        trade.putInt('cost', this.tradeList[index].getInt("cost"))
        trade.put('goods_nbt', this.tradeList[index].contains("goods_nbt") ? this.tradeList[index].get("goods_nbt") : new $CompoundTag())
        return trade
    },
    /**
     * 
     * @param {Internal.ItemStack} itemStack 
     * @returns 
     */
    setWithItem : function(itemStack) {
        if(itemStack.getId() != "kubejs:shop_order") {return this}
        if(!itemStack.getNbt()) {return this}
        this.item = itemStack
        this.tradeList = this.item.getNbt().get("TradeList")
        return this
    },
    getItem : function() {
        return this.item
    }
}