/**
 * 记录权重数据
 * @param {BeeBoxBuilder} bbb 
 * @param {number} tierWeight 
 * @param {number} typeWeight 
 */
function BeeBoxPoolsWeight(bbb, tierWeight, typeWeight){
    this.builder = bbb
    this.tierWeight = tierWeight
    this.typeWeight = typeWeight
    this.tier = bbb.tier
    this.type = bbb.type
}

/**
 * 蜂箱预设
 * @constant
 * @type {Object<string,function(Internal.Level, BlockPos):BeeBoxPoolsWeight>}
 */
const BeeBoxPresets = {
    "default" : function(level, pos){
        let bbb = new BeeBoxBuilder(level, pos)
        let tierWeight = 100
        let typeWeight = 100
        return new BeeBoxPoolsWeight(bbb, tierWeight, typeWeight)
    },
    "start_box" : function(level, pos){
        let structure = "kubejs:start_1"
        let bbb = new BeeBoxBuilder(level, pos)
        .addDecorator("dress_top_by_blocks")
        .addStructure(structure, new BlockPos(-14, 2, -13))
        .setType("start_box")
        let tierWeight = 0
        let typeWeight = 0
        console.log(structure)
        return new BeeBoxPoolsWeight(bbb, tierWeight, typeWeight)
    },
    "forest_box_1" : function(level, pos){
        let bbb = new BeeBoxBuilder(level, pos)
        .addDecorator("dress_top_by_blocks")
        // .addStructure("kubejs:natrual/forest_1", new BlockPos(-14, 2, -13))
        .addStructure("kubejs:natural/forest_1", new BlockPos(-14, 2, -13))
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
        .addDecorator("dress_top_by_blocks")
        .addStructure("kubejs:natural/swamp_1", new BlockPos(-14, 2, -13))
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
        let structure_1 = global.StructuresTypesPools["natural"]["kubejs:natural/swamp_2"].path
        let structure_2 = BeeBoxStructures["kubejs:natural/swamp_2"].path
        let structure_3 = "kubejs:natural/swamp_2"
        let bbb = new BeeBoxBuilder(level, pos)
        .addDecorator("dress_top_by_blocks")
        .addStructure(structure_3, new BlockPos(-14, 2, -13))
        // .addStructure("kubejs:natural/swamp_2", new BlockPos(-14, 2, -13))
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
        let decoratorArgs = new $CompoundTag()
        decoratorArgs.put("block_weight_data_list", NBT.compoundTag())
        let blockListData = decoratorArgs.getCompound("block_weight_data_list")
        blockListData.putInt("stone", 25)
        blockListData.putInt("sand", 2)
        blockListData.putInt("gravel", 1)
        blockListData.putInt("dirt", 10)
        blockListData.putInt("sandstone", 15)
        blockListData.putInt("tuff", 15)
        blockListData.putInt("minecraft:deepslate_iron_ore", 1)
        blockListData.putInt("air", 1)
        let bbb = new BeeBoxBuilder(level, pos)
        .addStructure("kubejs:natural/warm_ocean_1", new BlockPos(-14, 2, -13))
        .setAllWallBlock("minecraft:barrier")
        .setBiome("minecraft:warm_ocean")
        .addDecorator("hourglass", decoratorArgs)
        .setTier("t1")
        .setType("natural")
        let tierWeight = 100
        let typeWeight = 100
        return new BeeBoxPoolsWeight(bbb, tierWeight, typeWeight)
    },
    "natural_box_1" : function(level, pos){
        let decoratorArgs = new $CompoundTag()
        decoratorArgs.put("block_weight_data_list", NBT.compoundTag())
        let blockListData = decoratorArgs.getCompound("block_weight_data_list")
        blockListData.putInt("stone", 25)
        blockListData.putInt("sand", 2)
        blockListData.putInt("gravel", 1)
        blockListData.putInt("dirt", 10)
        blockListData.putInt("sandstone", 15)
        blockListData.putInt("tuff", 15)
        blockListData.putInt("minecraft:deepslate_iron_ore", 1)
        blockListData.putInt("air", 1)
        let bbb = new BeeBoxBuilder(level, pos)
        // .addStructure("kubejs:natural/warm_ocean_1", new BlockPos(-14, 2, -13))
        .addStructureRandomInPool(global.StructuresTypesPools["natural"])
        .setAllWallBlock("minecraft:barrier")
        .setBiome("minecraft:warm_ocean")
        .addDecorator("hourglass", decoratorArgs)
        .setTier("t1")
        .setType("natural")
        let tierWeight = 100
        let typeWeight = 100
        return new BeeBoxPoolsWeight(bbb, tierWeight, typeWeight)
    }
}