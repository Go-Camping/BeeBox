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
// Item.of('kubejs:shop_order', '{TradeList:[{cost:10,count:10,goods:"stone"},{cost:3,count:1,goods:"stick"},{cost:500,count:12,goods:"diamond"},{cost:250,count:2,goods:"forestry:serum_ge",goods_nbt:\'{ForgeCaps:{Parent:{analyzed:0b,genome:{"forestry:butterfly_effect":{active:"forestry:butterfly_effect_none",inactive:"forestry:butterfly_effect_none"},"forestry:butterfly_lifespan":{active:"forestry:20id",inactive:"forestry:20id"},"forestry:butterfly_species":{active:"forestry:butterfly_blue_duke",inactive:"forestry:butterfly_blue_duke"},"forestry:cocoon":{active:"forestry:cocoon_default",inactive:"forestry:cocoon_default"},"forestry:fertility":{active:"forestry:3i",inactive:"forestry:3i"},"forestry:fireproof":{active:"forestry:falsed",inactive:"forestry:falsed"},"forestry:flower_type":{active:"forestry:flower_type_vanilla",inactive:"forestry:flower_type_vanilla"},"forestry:humidity_tolerance":{active:"forestry:tolerance_none",inactive:"forestry:tolerance_none"},"forestry:metabolism":{active:"forestry:2i",inactive:"forestry:2i"},"forestry:never_sleeps":{active:"forestry:falsed",inactive:"forestry:falsed"},"forestry:size":{active:"forestry:0.5f",inactive:"forestry:0.5f"},"forestry:speed":{active:"forestry:0.3fd",inactive:"forestry:0.3fd"},"forestry:temperature_tolerance":{active:"forestry:tolerance_both_1d",inactive:"forestry:tolerance_both_1d"},"forestry:tolerates_rain":{active:"forestry:falsed",inactive:"forestry:falsed"}},health:20,max_heath:20}}}\'}]}')
}
