
function shopButtonGui(buttonId, x, y){
    this.type = "custommachinery:button"
    this.id = buttonId
    this.x = x
    this.y = y
    this.priority =  10
    this.hold_time = 1
    // this.texture = ""
}
function shopSlotGui(shopSlotId, x, y){
    this.type = "custommachinery:slot"
    this.id = shopSlotId
    this.x = x
    this.y = y
    // this.texture = ""
}

function shopRunningPage(){
    this.gui = []
}
shopRunningPage.prototype = {
    /**
     * 
     * @param {shopSlotGui | shopButtonGui} gui 
     */
    addGui : function(gui){
        this.gui.push(gui)
        return this
    },
    buildGui : function(){
        return this.gui
    }
//Item.of('kubejs:shop_order', '{TradeMap:[{cost:10,count:10,goods:"stone"},{cost:3,count:1,goods:"stick"},{cost:500,count:12,goods:"diamond"}]}')
///give @p kubejs:shop_order{TradeMap:[{cost:10,count:10,goods:"stone"},{cost:3,count:1,goods:"stick"},{cost:500,count:12,goods:"diamond"}]}
}
