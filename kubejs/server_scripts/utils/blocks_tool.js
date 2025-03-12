/**
 * 对指定的空间执行判断，返回满足条件的空间列表
 * @param {BlockPos} pos1 
 * @param {BlockPos} pos2 
 * @param {Function} predict
 */
function TestIn(pos1, pos2, predict){
    let startX = pos1.x
    let startY = pos1.y
    let startZ = pos1.z
    let endX = pos2.x
    let endY = pos2.y
    let endZ = pos2.z
    let result = []
    
    for (var x = Math.min(startX, endX); x <= Math.max(startX, endX); x++){
        for (var y = Math.min(endY, startY); y <= Math.max(endY, startY); y++){
            for (var z = Math.min(endZ, startZ); z <= Math.max(startZ, endZ); z++){
                if (predict(x, y, z)){
                    result.push(Pos2NBT(new BlockPos(x, y, z)))
                }
            }
        }
    }

    return result
}

/**
 * 对指定的空间执行判断，返回满足条件的空间列表
 * @param {BlockPos} pos
 * @param {Function} predict
 */
function NextTo(pos, predict){
    let result = []
    if (predict(pos.south())) result.push(Pos2NBT(pos.south()))
    if (predict(pos.north())) result.push(Pos2NBT(pos.north()))
    if (predict(pos.west())) result.push(Pos2NBT(pos.west()))
    if (predict(pos.east())) result.push(Pos2NBT(pos.east()))
    if (predict(pos.above())) result.push(Pos2NBT(pos.above()))
    if (predict(pos.below())) result.push(Pos2NBT(pos.below()))
    return result
}

/**
 * 
 * @param {BlockPos} center 
 * @param {number} radius 
 * @param {Function} connectors 
 * @param {Function} predict 
 */
function FindBlock(center, radius, connector, predict){
    let closed = []
    let connectors = [Pos2NBT(center)]
    let newConnectors = []
    let result = []

    /**
     * @param {BlockPos} pos 
     */
    function Scan(pos){
        if (Math.abs(pos.x - center.x) >= radius || Math.abs(pos.y - center.y) >= radius || Math.abs(pos.z - center.z) >= radius) return
        if (closed.some(n => {return PosEqual(n, pos)})) return
        newConnectors = newConnectors.concat(TestIn(pos.offset(-1, -1, -1), pos.offset(1, 1, 1), (x, y, z) =>{return !connectors.some(n =>{return PosNBTEqual(n, Pos2NBT(new BlockPos(x, y, z)))}) && connector(x, y, z)}))
        result = result.concat(TestIn(pos.offset(-1, -1, -1), pos.offset(1, 1, 1), (x, y, z) =>{return !result.some(n =>{return PosNBTEqual(n, Pos2NBT(new BlockPos(x, y, z)))}) && predict(x, y, z)}))
        closed.push(Pos2NBT(pos))
    }

    Scan(center)

    while (newConnectors.length != 0){
        connectors = newConnectors
        newConnectors = []
        connectors.forEach(connect =>{
            Scan(NBT2Pos(connect))
        })
    }

    return result
}

/**
 * @param {Internal.Level} level
 * @param {BlockPos} pos 
 * @param {string} block 
 */
function NextToBlock(level, pos, block){
    let test = NextTo(pos, (postion) =>{return level.getBlock(postion).id == block})
    return test.length
}

/**
 * BlockPos不能直接比较相等
 * @param {BlockPos} pos1 
 * @param {BlockPos} pos2 
 */
function PosEqual(pos1, pos2){
    return Math.round(pos1.x) == Math.round(pos2.x) && Math.round(pos1.y) == Math.round(pos2.y) && Math.round(pos1.z) == Math.round(pos2.z)
}

/**
 * NBT也不能直接比较相等
 * @param {Internal.CompoundTag} pos1 
 * @param {Internal.CompoundTag} pos2 
 */
function PosNBTEqual(pos1, pos2){
    return pos1.getInt('x') == pos2.getInt('x') && pos1.getInt('y') == pos2.getInt('y') && pos1.getInt('z') == pos2.getInt('z')
}

/**
 * @callback isValidBlockTarget
 * @param {Internal.BlockContainerJS}
 * @returns {Boolean}
 */
/**
 * 在某个范围内寻找符合条件的方块
 * @param {Internal.BlockContainerJS} block 
 * @param {number} searchRange 
 * @param {number} verticalSearchRange 
 * @param {function(Internal.BlockContainerJS):Boolean} isValidTarget
 * @returns {Internal.BlockContainerJS[]}
 */
function FindBlocksAroundBlock(block, searchRange, verticalSearchRange, isValidTarget) {
    let blockPos = block.pos
    let resBlockList = []
    let level = block.level
    // Y遍历
    for (let k = 0; k <= verticalSearchRange; k = k > 0 ? -k : 1 - k) {
        // X-Z遍历
        for (let l = 0; l <= searchRange; ++l) {
            for (let i = 0; i <= l; i = i > 0 ? -i : 1 - i) {
                for (let j = i < l && i > -l ? l : 0; j <= l; j = j > 0 ? -j : 1 - j) {
                    let curBlock = level.getBlock(blockPos.x + i, blockPos.y + k, blockPos.z + j)
                    if (isValidTarget(curBlock)) {
                        resBlockList.push(curBlock)
                    }
                }
            }
        }
    }
    return resBlockList
}