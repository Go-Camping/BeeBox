StartupEvents.registry('block', event => {
    // 天顶琼云木
    event.create('kubejs:zenith_clouds_log_root', 'basic')
    .hardness(10)
    .noDrops()
    // .noItem()
    .woodSoundType()
    .model("minecraft:block/cherry_log")
    .property(BlockProperties.AXIS)
    .defaultState(stateCallBack => {
        stateCallBack.set(BlockProperties.AXIS, "y")
    })
    .blockEntity(entity => {
        entity.initialData({
            TreeData:{
                "treeType": "kubejs:zenith_clouds_log",
                "budPos" : [],
                "limbPos" : [],
                "fruitPos" : [],
                "treeAge" : 0,
                "maxTreeAge" : 25,
                "branchGrowTreeAge" : 10,
                "fruitGrowTreeAge" : 15,
                "maxBranch" : 7,
                "nutrientAmount" : 0,
                "nutrientBlock" : "minecraft:water",
                "leaveBlock" : "kubejs:zenith_clouds_leave",
                "budLeaveBlock" : "kubejs:zenith_clouds_bud_leave",
                "limbBlock" : "kubejs:zenith_clouds_log",
                "fruitBlock" : "kubejs:zenith_clouds_fruit",
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
        let Gtree = global.GrowthTree(level, block.pos)
        Gtree.loadDataFromRoot().growUp(Math.floor(Math.random() * 10) + 1)
    })
    .tag('minecraft:mineable/axe')
    .tag('minecraft:logs')
    .tag('kubejs:growth_logs')
    .tag('kubejs:growth_root')
    .tag('minecraft:lava_pool_stone_cannot_replace')

    event.create('kubejs:zenith_clouds_log', 'basic')
    .hardness(10)
    .woodSoundType()
    .model("minecraft:block/cherry_log")
    .property(BlockProperties.AXIS)
    .defaultState(stateCallBack => {
        stateCallBack.set(BlockProperties.AXIS, "y")
    })
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
        })
    })
    .tag('minecraft:mineable/axe')
    .tag('minecraft:logs')
    .tag('kubejs:growth_logs')
    .tag('minecraft:lava_pool_stone_cannot_replace')

    event.create('kubejs:zenith_clouds_fruit', 'basic')
    .hardness(10)
    .woodSoundType()
    .model("minecraft:block/red_mushroom_block_inventory")
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
            fruitAge : 0
        })
    })
    .tag('minecraft:mineable/axe')
    .tag('kubejs:growth_fruit')
    .tag('minecraft:lava_pool_stone_cannot_replace')

    event.create("kubejs:zenith_clouds_leave", 'basic') 
    .hardness(1)
    .cropSoundType()
    // .renderType("cutout")
    .model("minecraft:block/cherry_leaves")
    .tag('minecraft:leaves')
    .tag('kubejs:growth_leaves')
    .tag('minecraft:mineable/hoe')
    .tag('minecraft:sword_efficient')
    .tag('forestry:grafter')
    .tag('minecraft:replaceable_by_trees')
    .tag('minecraft:lava_pool_stone_cannot_replace')

    event.create('kubejs:zenith_clouds_bud_leave', 'basic')
    .hardness(1)
    .noDrops()
    .cropSoundType()
    .renderType("cutout")
    .model("minecraft:block/cherry_leaves")
    .tag('minecraft:leaves')
    .tag('kubejs:growth_leaves')
    .tag('minecraft:mineable/hoe')
    .tag('minecraft:sword_efficient')
    .tag('forestry:grafter')
    .tag('minecraft:replaceable_by_trees')
    .tag('minecraft:lava_pool_stone_cannot_replace')

    event.create('kubejs:zenith_clouds_sapling')
    .model("minecraft:block/cherry_sapling")
    .renderType("translucent")
    .cropSoundType()
    .box(2, 0, 2, 14, 12, 14, true)
    .hardness(0)
    .noCollision()
    .randomTick(tick => {
        let block = tick.block
        let rootBlock = block.level.getBlock(block.pos.offset(0, -1, 0))
        let flag = rootBlock.offset(1, 0, 0).hasTag('minecraft:dirt') && 
            rootBlock.offset(-1, 0, 0).hasTag('minecraft:dirt') && 
            rootBlock.offset(0, 0, 1).hasTag('minecraft:dirt') && 
            rootBlock.offset(0, 0, -1).hasTag('minecraft:dirt')
        if(flag && rootBlock.hasTag('minecraft:dirt')){
            rootBlock.set("kubejs:zenith_clouds_log_root")
            let Gtree = global.GrowthTree(block.level, rootBlock.pos)
            block.set("minecraft:air")
            Gtree.loadDataFromRoot().growUp(2)
        }else{
            block.level.destroyBlock(block.pos, true)
        }
    })
    .tag('minecraft:saplings')
})