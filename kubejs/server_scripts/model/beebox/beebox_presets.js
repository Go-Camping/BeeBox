/**
 * 记录权重数据
 * @param {BeeBoxBuilder} bbb 
 * @param {number} tierWeight 
 * @param {number} typeWeight 
 */
function BeeBoxPoolsWeight(bbb, tierWeight, typeWeight){
    this.bbb = bbb
    this.tierWeight = tierWeight
    this.typeWeight = typeWeight
    this.tier = bbb.tier
    this.type = bbb.type
}

/**
 * 蜂箱预设
 * @constant
 * @type {Object<string,function(Internal.Level, BlockPos):BeeBoxPoolsWeight}
 */
const BeeBoxPresets = {
    "default" : function(level, pos){
        let bbb = new BeeBoxBuilder(level, pos)
        let tierWeight = 100
        let typeWeight = 100
        return new BeeBoxPoolsWeight(bbb, tierWeight, typeWeight)
    },
    "start_box" : function(level, pos){
        let bbb = new BeeBoxBuilder(level, pos)
        .addDecoration("hourglass")
        .setType("start_box")
        let tierWeight = 100
        let typeWeight = 100
        return new BeeBoxPoolsWeight(bbb, tierWeight, typeWeight)
    },
    "forest_box_1" : function(level, pos){
        let bbb = new BeeBoxBuilder(level, pos)
        .addDecoration("dress_top_by_blocks")
        .addStructure("kubejs:biome/forest_1", new BlockPos(-14, 2, -13))
        .setBiome("minecraft:forest")
        .setAllWallBlock("minecraft:stripped_oak_wood")
        .setTopBlock("minecraft:blue_glazed_terracotta")
        .setFloorBlock("kubejs:beehive")
        .setTier("t1")
        .setType("natural")
        let tierWeight = 100
        let typeWeight = 100
        return new BeeBoxPoolsWeight(bbb, tierWeight, typeWeight)
    },
    "swamp_box_1" : function(level, pos){
        let bbb = new BeeBoxBuilder(level, pos)
        .addDecoration("dress_top_by_blocks")
        .addStructure("kubejs:biome/swamp_1", new BlockPos(-14, 2, -13))
        .setBiome("minecraft:swamp")
        .setAllWallBlock("minecraft:stripped_mangrove_wood")
        .setTopBlock("minecraft:yellow_stained_glass")
        .setFloorBlock("kubejs:beehive")
        .setTier("t1")
        .setType("natural")
        let tierWeight = 100
        let typeWeight = 100
        return new BeeBoxPoolsWeight(bbb, tierWeight, typeWeight)
    },
    "swamp_box_2" : function(level, pos){
        let bbb = new BeeBoxBuilder(level, pos)
        .addDecoration("dress_top_by_blocks")
        .addStructure("kubejs:biome/swamp_2", new BlockPos(-14, 2, -13))
        .setBiome("minecraft:swamp")
        .setAllWallBlock("minecraft:stripped_mangrove_wood")
        .setFloorBlock("kubejs:beehive")
        .setTier("t1")
        .setType("natural")
        let tierWeight = 100
        let typeWeight = 100
        return new BeeBoxPoolsWeight(bbb, tierWeight, typeWeight)
    },
    "warm_ocean_box_1" : function(level, pos){
        let bbb = new BeeBoxBuilder(level, pos)
        .addStructure("kubejs:biome/warm_ocean_1", new BlockPos(-14, 2, -13))
        .setBiome("minecraft:warm_ocean")
        .setAllWallBlock("minecraft:barrier")
        .addDecoration("hourglass")
        .setTier("t1")
        .setType("natural")
        let tierWeight = 100
        let typeWeight = 100
        return new BeeBoxPoolsWeight(bbb, tierWeight, typeWeight)
    }
}