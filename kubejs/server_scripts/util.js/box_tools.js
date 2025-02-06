
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

