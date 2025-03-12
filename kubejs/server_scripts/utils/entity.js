// priority: 1000
/**
 * @callback isValidTarget
 * @param {Internal.BlockContainerJS}
 * @returns {Boolean}
 */
/**
 * 在某个范围内寻找符合条件的方块
 * @param {Internal.PathfinderMob} mob 
 * @param {number} searchRange 
 * @param {number} verticalSearchRange 
 * @param {number} verticalOffset 
 * @param {function(Internal.BlockContainerJS):Boolean} isValidTarget
 * @returns {Internal.BlockContainerJS[]}
 */
function FindNearBlocks(mob, searchRange, verticalSearchRange, verticalOffset, isValidTarget) {
    let blockPos = mob.blockPosition().offset(0, verticalOffset, 0);
    let mutableBlockPos = BlockPos.ZERO.mutable()
    let resBlockList = []

    // Y遍历
    for (let k = 0; k <= verticalSearchRange; k = k > 0 ? -k : 1 - k) {
        // X-Z遍历
        for (let l = 0; l <= searchRange; ++l) {
            for (let i = 0; i <= l; i = i > 0 ? -i : 1 - i) {
                for (let j = i < l && i > -l ? l : 0; j <= l; j = j > 0 ? -j : 1 - j) {
                    mutableBlockPos.setWithOffset(blockPos, i, k, j)
                    let curBlock = mob.level.getBlock(mutableBlockPos.x, mutableBlockPos.y, mutableBlockPos.z)
                    if (mob.isWithinRestriction(mutableBlockPos) && isValidTarget(curBlock)) {
                        resBlockList.push(curBlock)
                    }
                }
            }
        }
    }
    return resBlockList
}

// /**
//  * 
//  * @param {Internal.Mob} mob 
//  * @param {string} blockId 
//  * @param {number} range 
//  */
// function mobGotoNearTargetBlock(mob, blockId, range){
//     let blockList = FindNearBlocks(mob, range, 5, 0, (block) => {
//         return block.id == blockId
//     })
//     if(blockList.length > 0){
//         mob.getNavigation().stop()
//         mob.getNavigation().moveTo(blockList[0].x, blockList[0].y + 1, blockList[0].z, 0.75)
//     }
//     return blockList
// }