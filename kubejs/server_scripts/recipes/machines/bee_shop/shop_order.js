function ShopOrder(){
    this.item = Item.of('kubejs:shop_order', '{TradeList:[{"goods":"minecraft:air"}]}')
    /**
     * @type {Internal.CompoundTag[]} 
     */
    this.tradeList = this.item.getNbt().get("TradeList")
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
        this.tradeList[this.tradeList.length - 1].putString("goods_nbt", itemStack.getNbtString())
        return this
    },
    getTrade : function(index) {
        return this.tradeList[index]
    },
    setWithItem : function(itemStack) {
        if(itemStack.getId() != "kubejs:shop_order") {return this}
        if(itemStack.getNbt().get("TradeList").length == 0) {return this}
        this.item = itemStack
        this.tradeList = item.getNbt().get("TradeList")
        return this
    },
    build : function() {
        return this.item
    }
}