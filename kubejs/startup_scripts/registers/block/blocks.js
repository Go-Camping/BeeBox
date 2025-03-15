StartupEvents.registry('block', event => {

    event.create("kubejs:royal_jelly_crystal_block")

    event.create('kubejs:beeswax_block', 'basic')
    .hardness(1)
    .noValidSpawns(true)
    .textureAll("minecraft:block/honeycomb_block")

    event.create('kubejs:drone_cell', 'basic')
    
    event.create('kubejs:store_cell', 'basic')

    event.create('kubejs:internal_cell', 'basic')

    event.create('kubejs:external_cell', 'basic')

    event.create('kubejs:hatch_cell', 'basic')

    event.create('kubejs:zenith_clouds_log_root', 'basic')
    .hardness(10)
    .textureAll("minecraft:block/light_gray_terracotta")
    .blockEntity(entity => {
        entity.initialData({
            TreeData:{
                "tree_type": "kubejs:zenith_clouds_log",
                "budPos" : [],
                "limbPos" : [],
                "fruitPos" : [],
                "treeAge" : 0,
            }
        })
        // entity.serverTick()
    })

    event.create('kubejs:zenith_clouds_log', 'basic')
    .hardness(10)
    .textureAll("minecraft:block/light_gray_terracotta")
    .blockEntity(entity => {
        entity.initialData({
            RootData:{
                "x" : 0,
                "y" : 320,
                "z" : 0
                // "tree_type" : "kubejs:zenith_clouds_log",
            },
            Branch : 0
        })
    })
})