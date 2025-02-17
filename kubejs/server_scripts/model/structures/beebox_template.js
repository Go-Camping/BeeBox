const BeeBoxTemplate = {
    "forest_box_1" : function(level, pos){
        return new BeeBoxBuilder(level, pos)
        .addDecoration("dress_top_by_block")
        .addStructure("kubejs:biome/forest_1", new BlockPos(-14, 1, -13))
        .setBiome("minecraft:forest")
        .setAllWallBlock("minecraft:stripped_oak_wood")
        .setTopBlock("minecraft:blue_glazed_terracotta")
        .setFloorBlock("kubejs:beehive")
    },
    "swamp_box_1" : function(level, pos){
        return new BeeBoxBuilder(level, pos)
        .addDecoration("dress_top_by_block")
        .addStructure("kubejs:biome/swamp_1", new BlockPos(-14, 1, -13))
        .setBiome("minecraft:swamp")
        .setAllWallBlock("minecraft:stripped_mangrove_wood")
        .setTopBlock("minecraft:yellow_stained_glass")
        .setFloorBlock("kubejs:beehive")
    }
}