
const BeeBoxPresets = {
    /**
     * 默认的蜂箱预设
     * @param {*} level 
     * @param {*} pos 
     * @returns 返回一个由BeeBoxBuilder和权重组成的数组
     */
    "default" : function(level, pos){
        let bbb = new BeeBoxBuilder(level, pos)
        return [bbb, 100]
    },
    "forest_box_1" : function(level, pos){
        let bbb = new BeeBoxBuilder(level, pos)
        .addDecoration("dress_top_by_lime_stained_glass")
        .addStructure("kubejs:biome/forest_1", new BlockPos(-14, 1, -13))
        .setBiome("minecraft:forest")
        .setAllWallBlock("minecraft:stripped_oak_wood")
        .setTopBlock("minecraft:blue_glazed_terracotta")
        .setFloorBlock("kubejs:beehive")
        .setTier("t1")
        return [bbb, 100]
    },
    "swamp_box_1" : function(level, pos){
        let bbb = new BeeBoxBuilder(level, pos)
        .addDecoration("dress_top_by_lime_stained_glass")
        .addStructure("kubejs:biome/swamp_1", new BlockPos(-14, 1, -13))
        .setBiome("minecraft:swamp")
        .setAllWallBlock("minecraft:stripped_mangrove_wood")
        .setTopBlock("minecraft:yellow_stained_glass")
        .setFloorBlock("kubejs:beehive")
        .setTier("t1")
        return [bbb, 100]
    }
}