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
                "maxTreeAge" : 25
            }
        })
    })
    .randomTick(tick => {
        let block = tick.block
        let level = block.level
        if(block.id != 'kubejs:zenith_clouds_log_root'){return}
        /**
         * @type {GrowthTree}
         */
        let Gtree = global.ZenithCloudsTree(level, block.pos)
        Gtree.loadDataFromRoot().growUp(Math.floor(Math.random() * 10))
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
            ParentLimbPos : {
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

    event.create("kubejs:zenith_clouds_spaling", "crop") //树苗
    .growTick(tick => {
        // tick.block.setBlockState()
        // let block = tick.block
        // if(block.id != 'kubejs:zenith_clouds_spaling'){return}
        // if(Math.random() < 0.5){
        //     let level = block.level
        //     let rootBlock = level.getBlock(block.pos.offset(0, -1, 0))
        //     // level.tell("[crop: " + block.id + ", pos: " + rootBlock.id + "]")
        //     rootBlock.set("kubejs:zenith_clouds_log_root")
        //     /**
        //      * @type {GrowthTree}
        //      */
        //     let Gtree = global.ZenithCloudsTree(block.level, rootBlock.pos)
        //     Gtree.loadDataFromRoot().growUp(1)
        //     // block.set(Gtree.leaveBlock)
        // }
    })
    .randomTick(tick => {

    })

    event.create('kubejs:zenith_clouds_bud_leave', 'basic')
    .hardness(10)
    .noDrops()
    .textureAll("minecraft:block/minecraft:moss_block")
})