StartupEvents.registry('block', event => {
    event.create('kubejs:zenith_clouds_log_root', 'basic')
    .hardness(10)
    .noDrops()
    .tag('minecraft:mineable/axe')
    .tag('minecraft:logs')
    .tag('minecraft:lava_pool_stone_cannot_replace')
    .textureAll("minecraft:block/light_gray_terracotta")
    .blockEntity(entity => {
        entity.initialData({
            TreeData:{
                "treeType": "kubejs:zenith_clouds_log",
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
    .tag('minecraft:mineable/axe')
    .tag('minecraft:logs')
    .tag('minecraft:lava_pool_stone_cannot_replace')
    .textureAll("minecraft:block/light_gray_terracotta")
    .blockEntity(entity => {
        entity.initialData({
            RootPos:{
                "x" : 0,
                "y" : 320,
                "z" : 0
            },
            SonLimbPos : {
                "x" : 0,
                "y" : 320,
                "z" : 0
            },
            // LeaveStatus : 0
        })
    })

    event.create('kubejs:zenith_clouds_fruit', 'basic')
    .hardness(10)
    .tag('minecraft:mineable/axe')
    .tag('minecraft:lava_pool_stone_cannot_replace')
    .textureAll("minecraft:block/minecraft:red_mushroom_block")
    .blockEntity(entity => {
        entity.initialData({
            fruitAge : 0
        })
    })

    // event.create("kubejs:crop", "crop") //作物

})