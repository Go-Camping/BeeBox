ForestryEvents.apiculture(event=>{
    
    for (var effect in serverDoEffect){
        let dataValidation = effect
        let clientEffect = effect
        if (!(effect in effectDataValidation)) dataValidation = "default_data_validation"
        if (!(effect in clientDoEffect)) clientEffect = "default_client_effect"
        //todo: 效果注册中的那个布尔值似乎指的是基因显隐性，有待进一步测试
        event.registerBeeEffect(effect, effectDataValidation[dataValidation], true, serverDoEffect[effect], clientDoEffect[clientEffect], true)
    }


})


/**
 * 数据合法性验证，验证读取的蜜蜂数据是否可用于效果计算，并将非法数据合法化
 * @constant
 * @type {Object<string,function(Internal.IEffectData):Internal.IEffectData>}
 */

const effectDataValidation = {
    "default_data_validation" : function(iEffectdata){
        //默认函数可用于大多数情形，即防止数据为空即可
        if (iEffectdata == null) iEffectdata = new $EffectData(3, 0)
        return iEffectdata
    }
}

/**
 * 服务端蜜蜂效果，参数分别为：蜜蜂基因数据，蜜蜂效果数据，蜂箱数据
 * @constant
 * @type {Object<string,function(Internal.IGenome, Internal.IEffectData, Internal.IBeeHousing):Internal.IEffectData>}
 */

const serverDoEffect = {
    "kubejs:example_effect" : function(iGenome, iEffectdata, iBeeHousing){
        //每两秒从16格附近玩家手里拿一个物品的实例     
        let level = iBeeHousing.getWorldObj()
        let owner = iBeeHousing.owner
        let inventory = iBeeHousing.getBeeInventory()
        let postion = iBeeHousing.getCoordinates()
        let player = level.getPlayerByUUID(owner.id)
        if (player.isPlayer()){
            if (player.age % 40 == 0){
                if (player.mainHandItem != "minecraft:air"){
                    if (player.getDistance(postion) >= 16) return iEffectdata
                    //todo :但还是有点问题，一次会消耗两个，添加一组，可能与kubejs的tick事件监听有关
                    inventory.addProduct(Item.of(player.mainHandItem, 1), false)
                    player.mainHandItem.shrink(1)
                }
            }
        }
        return iEffectdata
    }
}

/**
 * 客户端蜜蜂效果
 * @constant
 * @type {Object<string,function(Internal.IGenome, Internal.IEffectData, Internal.IBeeHousing):Internal.IEffectData>}
 */

const clientDoEffect = {
    "default_client_effect" : function(iGenome, iEffectdata, iBeeHousing){
        //客户端似乎不太需要很复杂的效果，所以提供了一个default函数
        return iEffectdata
    }
}

/**
 * 注册染色体常量（非必须，但方便复用）
 * @constant
 * @type {Object<string,Internal.IRegistryAllele<Internal.IBeeEffect>>}
 */

const effectAlleles = {
    "example_alleles" : ForestryAlleles.REGISTRY.registryAllele(new ResourceLocation("kubejs","example_effect"), BeeChromosomes.EFFECT)
}
