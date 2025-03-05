
/**
 * 寻找附近的BeeBoxCenter方块坐标
 * @param {Internal.Level} level 
 * @param {BlockPos} startPos 起始坐标
 * @param {number} range 水平范围
 * @param {number} verticalRange 垂直范围，仅向下搜索
 * @returns {BlockPos | null}
 */
function findCurrentBoxCenter(level, startPos, range, verticalRange) {
    let centerPosList = []
    for(let i = 0; i < verticalRange; i++){
        let vBlock = level.getBlock(startPos.x, startPos.y - i, startPos.z)
        centerPosList = FindBlocksAroundBlock(vBlock, range, 1, (block) => {
            return (block.id == "kubejs:beebox_center")
        })
        if(centerPosList.length > 0){
            break
        }
    }
    let distance = Infinity
    let centerPos = null
    centerPosList.forEach((/** @type {Internal.BlockContainerJS} */ block) => {
        let pos = block.pos
        let dist = Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2) + Math.pow(pos.z - startPos.z, 2)
        if(dist < distance){
            centerPos = pos
        }
    })
    return centerPos
}

/**
 * 蜂箱权重池初始化
 * @param {Internal.Level} level 
 * @returns 
 */
function BeeBoxPoolsInit(level){
    let pos = new BlockPos(0, 0, 0)
    Object.keys(BeeBoxStructures).forEach(structureId => {
        let currentStructure = BeeBoxStructures[structureId]
        currentStructure.type_pools.forEach(poolId => {
            if(global.StructuresTypesPools.hasOwnProperty(poolId)){
                global.StructuresTypesPools[poolId][structureId] = {
                    "path" : currentStructure.path,
                    "weight" : currentStructure.weight,
                    "offset" : currentStructure.offsetPos
                }
            }
        })
    })
    Object.keys(BeeBoxPresets).forEach(presetId => {
        /**
         * @type {BeeBoxPoolsWeight}
         */
        let poolsWeight = BeeBoxPresets[presetId](level, pos)
        let bbb = poolsWeight.builder
        let tierWeight = poolsWeight.tierWeight
        let typeWeight = poolsWeight.typeWeight
        AddPresetToTierPool(presetId, bbb.tier, tierWeight)
        // if(global.BeeBoxTypesPool[bbb.type]){
        //     global.BeeBoxTypesPool[bbb.type][presetId] = typeWeight
        // }
        AddPresetToTypePool(presetId, bbb.type, typeWeight)
    })
    return 
}

/**
 * 
 * @param {Internal.Level} level 
 */
function BeeBoxLevelStartUpInit(level){
    if(level.dimensionTypeId() != "minecraft:overworld"){return}
    let startPos = new BlockPos(0, 62, 0)
    if(level.getBlock(startPos).id != "minecraft:air"){return}
    level.setBlockAndUpdate(startPos, Block.getBlock("kubejs:magic_bee_candy_block").defaultBlockState())
    level.server.runCommandSilent(`/setworldspawn 0 64 0`)
    // let startBox = new BeeBoxBuilder(level, startCenterPos)
    // startBox.preset("start_box").buildBox()
    console.log("BeeBox StartBox Done")
}

/**
 * 
 * @param {string} presetId 
 * @param {string} tier 
 * @param {number} weight 
 */
function AddPresetToTierPool(presetId, tier, weight){
    if(!BeeBoxPresets.hasOwnProperty(presetId)){return}
    if(global.BeeBoxTiersPools.hasOwnProperty(tier)){
        global.BeeBoxTiersPools[tier][presetId] = weight
    }
}

/**
 * 
 * @param {string} presetId 
 * @param {string} type 
 * @param {number} weight 
 */
function AddPresetToTypePool(presetId, type, weight){
    if(!BeeBoxPresets.hasOwnProperty(presetId)){return}
    if(global.BeeBoxTypesPools.hasOwnProperty(type)){
        global.BeeBoxTypesPools[type][presetId] = weight
    }
}

/**
 * 返回数组中的一个随机元素
 * @param {Array} list 
 * @returns 
 */
function randomInList(list){
    let random = Math.random()
    if(list.length > 0){
        return list[Math.floor(random * (list.length))]
    }else{
        return
    }
}

/**
 * 获取一个指定池子的筑巢令
 * @param {String?} tiers 蜂箱等级，生成时优先级最低
 * @param {String?} type 蜂箱类型 生成时优先级中等
 * @param {String?} presetId 预设id生成时优先级最高
 * @returns 
 */
function getNestingOrderItem(tiers, type, presetId){
    let item = Item.of("kubejs:nesting_order")
    let nbt = item.getNbt()
    if(global.BeeBoxTiersPools[tiers]){
        nbt.putString("box_tier", tiers)
    }
    if(global.BeeBoxTypesPools[type]){
        nbt.putString("box_type", type)
    }
    if(presetId && BeeBoxPresets.hasOwnProperty(presetId)){
        nbt.putString("box_preset", presetId)
    }
    return Item.of("kubejs:nesting_order", `${nbt.toString()}`)
}

/**
 * 用于建筑蜂箱的柱子单元
 * @param {Internal.Level} level 
 * @param {*} block 
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 * @param {*} high 
 * @returns  该次建筑的方块列表
 */
function blockColumnUnit(level, block, x, y, z, high){
    let blockList = []
    let baseBlockPos = new BlockPos(x, y, z)
    for(let h = 0; h <= high; h++){
        let block_1 = level.getBlock(baseBlockPos.offset(0, h, 0))
        let block_2 = level.getBlock(baseBlockPos.offset(1, h, 0))
        let block_3 = level.getBlock(baseBlockPos.offset(0, h, 1))
        let block_4 = level.getBlock(baseBlockPos.offset(1, h, 1))
        block_1.set(block)
        block_2.set(block)
        block_3.set(block)
        block_4.set(block)
        blockList.push(block_1)
        blockList.push(block_2)
        blockList.push(block_3)
        blockList.push(block_4)
    }
    return blockList
}