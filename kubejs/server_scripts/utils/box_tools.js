
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
 * 初始化
 * @param {*} level 
 * @param {*} pos 
 * @returns 
 */
function BeeBoxPresetsWeightInit(level, pos){
    Object.keys(BeeBoxPresets).forEach(persetId => {
        /**
         * @type {BeeBoxPoolsWeight}
         */
        let poolsWeight = BeeBoxPresets[persetId](level, pos)
        let bbb = poolsWeight.bbb
        let tierWeight = poolsWeight.tierWeight
        let typeWeight = poolsWeight.typeWeight
        if(global.BeeBoxTiersPool[bbb.tier]){
            global.BeeBoxTiersPool[bbb.tier][persetId] = tierWeight
        }
        if(global.BeeBoxTypesPool[bbb.type]){
            global.BeeBoxTypesPool[bbb.type][persetId] = typeWeight
        }
    })
    // 结构：global.BeeBoxTiersPool
    // global.BeeBoxTiersPool = {
    //     "t0" : {
    //         "id": weight,
    //         "id": weight,
    //     },
    // }
    return 
}

/**
 * 
 * @param {string} presetID 
 * @param {string} tier 
 * @param {number} weight 
 */
function AddPresetToTierPool(presetID, tier, weight){
    global.BeeBoxTiersPool[tier][presetID] = weight
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
 * @param {String?} tiers 蜂箱等级
 * @param {String?} type 蜂箱类型 生成时优先级高于tiers
 * @param {String?} presetId 预设id
 * @returns 
 */
function getNestingOrderItem(tiers, type){
    let item = Item.of("kubejs:nesting_order")
    let nbt = item.getNbt()
    if(global.BeeBoxTiersPool[tiers]){
        nbt.putString("box_tier", tiers)
    }
    if(global.BeeBoxTypesPool[type]){
        nbt.putString("box_type", type)
    }
    return Item.of("kubejs:nesting_order", `${nbt.toString()}`)
}