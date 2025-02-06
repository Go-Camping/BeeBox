StartupEvents.registry('block', event => {
    event.create('kubejs:beehive')
        .hardness(-1)
        .noDrops()
        .unbreakable()

    event.create('kubejs:beebox_center')
        .hardness(-1)
        .noDrops()
        .unbreakable()

    event.create('kubejs:beebox_float', "basic")
        .hardness(-1)
        .unbreakable()   
        .noDrops()
        .noValidSpawns(true)
        .transparent(true)
        .textureAll("minecraft:block/honeycomb_block")

    event.create('kubejs:bee_shop', "custommachinery")
        .machine("kubejs:bee_shop")
        
    
})