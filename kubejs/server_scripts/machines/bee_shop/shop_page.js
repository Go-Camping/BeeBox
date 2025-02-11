/**
 * 
 * @param {String} buttonId 
 * @param {number} x 
 * @param {number} y 
 */
function shopButtonGui(buttonId, x, y){
    this.type = "custommachinery:button"
    this.id = buttonId
    this.x = x
    this.y = y
    this.priority =  10
    this.hold_time = 1
    // this.texture = ""
}
/**
 * 一个物品槽
 * @param {String} shopSlotId 
 * @param {number} x 
 * @param {number} y 
 */
function shopSlotGui(shopSlotId, x, y){
    this.type = "custommachinery:slot"
    this.id = shopSlotId
    this.x = x
    this.y = y
    // this.texture = ""
}
/**
 * 商店页面
 */
function shopRunningPage(){
    this.gui = []
}
shopRunningPage.prototype = {
    /**
     * 添加一个gui
     * @param {shopSlotGui | shopButtonGui} gui 
     */
    addGui : function(gui){
        this.gui.push(gui)
        return this
    },
    buildGui : function(){
        return this.gui
    }
}
