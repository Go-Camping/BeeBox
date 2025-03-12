EntityEvents.spawned(event => {
    /**
     * @type {Internal.Mob}
     */
    let entity = event.entity
    // event.level.tell("trying to spawn champion")
    if(!entity || !entity.isLiving() || !entity.isMonster()) {return}
    let typeList = entity.persistentData.get('champion') ?? []
    let spawnBoxPos = findCurrentBoxCenter(entity.getLevel(), entity.blockPosition(), BeeBoxDefaultSize.boxLength, BeeBoxDefaultSize.boxHigh)
    if(!spawnBoxPos){return}
    let spawnBox = new BeeBoxBuilder(entity.getLevel(), spawnBoxPos).loadDataFromCenter()
    let diff = Math.max(spawnBox.getTierByNumber(), 1)
    if(entity.attributes.hasAttribute('minecraft:generic.max_health')){
        entity.setAttributeBaseValue("minecraft:generic.max_health", entity.getAttributeBaseValue('minecraft:generic.max_health') * Math.pow(2, diff - 1))
        entity.setHealth(entity.getMaxHealth())
    }
    if (entity.attributes.hasAttribute('minecraft:generic.attack_damage')){
        entity.setAttributeBaseValue("minecraft:generic.attack_damage", entity.getAttributeBaseValue('minecraft:generic.attack_damage') * (diff))
    }
    if(entity.attributes.hasAttribute('minecraft:generic.armor')){
        entity.setAttributeBaseValue("minecraft:generic.armor", entity.getAttributeBaseValue('minecraft:generic.armor') * diff + diff * 2)
    }
    if (entity.attributes.hasAttribute('minecraft:generic.armor_toughness')) {
        entity.setAttributeBaseValue('minecraft:generic.armor_toughness', (entity.getAttribute('minecraft:generic.armor_toughness').getValue() + diff - 1) * (diff * 0.5 + 0.5))
    }
    if(entity.attributes.hasAttribute('minecraft:generic.movement_speed')){
        entity.setAttributeBaseValue('minecraft:generic.movement_speed', entity.getAttribute('minecraft:generic.movement_speed').getValue() * ((diff - 1) * 0.1 + 1))
    }
    // event.level.tell("§3 type:" + entity.type + " tier:" + diff + " health:" + entity.getMaxHealth())
})
