StartupEvents.registry('block', event => {
    event.create('kubejs:beehive')
        .hardness(-1)
        .noDrops()
        .noValidSpawns(true)
        .unbreakable()

    event.create('kubejs:magic_bee_candy_block')
        .hardness(-1)
        .noDrops()
        .noValidSpawns(true)
        .unbreakable()

    event.create('kubejs:beebox_dooreye', "basic")
        .blockEntity(entity => {
            entity.initialData({
                "WallData":{
                    "wall_number" : 0,
                    "box_center_x" : 0,
                    "box_center_y" : 0,
                    "box_center_z" : 0
                }
            })
        })
        .noDrops()
        .noValidSpawns(true)
        .unbreakable()

    event.create('kubejs:beebox_center', "basic")
        .noDrops()
        .noValidSpawns(true)
        .unbreakable()
        .blockEntity(entity => {
            entity.initialData({
                "BeeBoxData":{
                    "boxLength" : 16,
                    "boxHigh" : 20,
                    "boxTier" : "t0",
                    "boxType" : "default",
                    "biome" : "the_void",
                    "floor" : "kubejs:beebox_phantasm_block_7",
                    "top" : "kubejs:beebox_phantasm_block_7",
                    "structures" : [],
                    "walls" : [
                        "kubejs:beebox_phantasm_block_7",
                        "kubejs:beebox_phantasm_block_7",
                        "kubejs:beebox_phantasm_block_7",
                        "kubejs:beebox_phantasm_block_7",
                        "kubejs:beebox_phantasm_block_7",
                        "kubejs:beebox_phantasm_block_7",
                    ],
                    "doors" : [0,0,0,0,0,0],
                    "decorators" : []
                }
            })
        })

    event.create('kubejs:beebox_phantasm_block_1', "basic")
        .hardness(-1)
        .unbreakable()   
        .noDrops()
        .noValidSpawns(true)
        .textureAll("minecraft:block/honeycomb_block")

    event.create('kubejs:beebox_phantasm_block_2', "basic")
        .hardness(-1)
        .unbreakable()   
        .noDrops()
        .noValidSpawns(true)
        .textureAll("minecraft:block/dirt")
        // .model(("minecraft:block/dirt"))

    event.create('kubejs:beebox_phantasm_block_3', "basic")
        .hardness(-1)
        .unbreakable()   
        .noDrops()
        .noValidSpawns(true)
        .model("minecraft:block/oak_planks")
        // .textureAll("minecraft:block/oak_planks")

    event.create('kubejs:beebox_phantasm_block_4', "basic")
        .hardness(-1)
        .unbreakable()   
        .noDrops()
        .noValidSpawns(true)
        .model("minecraft:block/stripped_oak_wood")
        // .textureAll("minecraft:block/stripped_oak_wood")

    event.create('kubejs:beebox_phantasm_block_5', "basic")
        .hardness(-1)
        .unbreakable()   
        .noDrops()
        .renderType("translucent")
        .noValidSpawns(true)
        .transparent(true)
        .model("kubejs:block/beebox_lime_stained_glass")
        // .textureAll("kubejs:block/beebox_lime_stained_glass")

    event.create('kubejs:beebox_phantasm_block_6', "basic")
        .hardness(-1)
        .unbreakable()   
        .noDrops()
        .noValidSpawns(true)
        .model("minecraft:block/jungle_wood")
    
    event.create('kubejs:beebox_phantasm_block_7', "basic")
        .hardness(-1)
        .unbreakable()   
        .noDrops()
        .noValidSpawns(true)
        .model("minecraft:block/warped_hyphae")
})