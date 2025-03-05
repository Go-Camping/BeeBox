EntityJSEvents.addGoalSelectors("minecraft:zombie", event => {
    event.breakDoor(50, 100, (difficulty) => {
        difficulty.getId()
    })
    event.customGoal("kubejs:zombie_moveto_level_center",
        5,
        (mob) => true,
        (mob) => true,
        true,
        (mob) => {},// start
        /** @param {Internal.Mob} mob */
        (mob) => {mob.getNavigation().stop()}, // stop
        false,
        /** @param {Internal.Mob} mob */
        (mob) => {
            mob.getNavigation().moveTo(0,64,0,0.75)
        },// tick
    )
    event.customGoal("kubejs:mob_find_near_target_block",
        10,
        (mob) => true,
        (mob) => true,
        true,
        (mob) => {},
        /** @param {Internal.Mob} mob */
        (mob) => {mob.getNavigation().stop()},
        false,
        /** @param {Internal.Mob} mob */
        (mob) => {
            let blockList = mobFindNearTargetBlock(mob, 'minecraft:honeycomb_block', 5)
            if(blockList.length > 0){
                let distance = mob.getBoundingBox().distanceToSqr([blockList[0].x, blockList[0].y, blockList[0].z])
                mob.level.tell(distance)
                if(distance <= 1.5){
                    mob.attack(mob.maxHealth * 0.2)
                    blockList[0].set("air")
                }
            }
            return true
        },
    )
})

/**
 * 
 * @param {Internal.Mob} mob 
 * @param {string} blockId 
 * @param {number} range 
 */
function mobFindNearTargetBlock(mob, blockId, range){
    let blockList = FindNearBlocks(mob, range, 5, 0, (block) => {
        return block.id == blockId
    })
    if(blockList.length > 0){
        mob.getNavigation().stop()
        mob.getNavigation().moveTo(blockList[0].x, blockList[0].y + 1, blockList[0].z, 0.75)
    }
    return blockList
}