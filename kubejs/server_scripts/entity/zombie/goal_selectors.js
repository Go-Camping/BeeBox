
EntityJSEvents.addGoalSelectors("minecraft:zombie", event => {
    event.breakDoor(50, 100, (difficulty) => {
        difficulty.getId()
    })
    // event.customGoal("kubejs:zombie_moveto_level_center",
    //     5,
    //     (mob) => true,
    //     (mob) => true,
    //     true,
    //     (mob) => {},// start
    //     /** @param {Internal.Mob} mob */
    //     (mob) => {mob.getNavigation().stop()}, // stop
    //     false,
    //     /** @param {Internal.Mob} mob */
    //     (mob) => {
    //         mob.getNavigation().moveTo(0,64,0,0.75)
    //     },// tick
    // )
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
            // let blockList = mobFindNearTargetBlock(mob, 'minecraft:honeycomb_block', 5)
            try{
                let blockList = FindNearBlocks(mob, 10, 5, 0, (block) => {
                    return block.id == 'minecraft:honeycomb_block'
                })
                if(blockList.length > 0){
                    mob.getNavigation().moveTo(blockList[0].x, blockList[0].y, blockList[0].z, 0.75)
                    let distance = mob.getBoundingBox().distanceToSqr([blockList[0].x, blockList[0].y, blockList[0].z])

                    // let distance = mob.getNavigation().getPath().getTarget()
                    // mob.level.tell(mob.getAttributeValue("minecraft:generic.movement_speed"))
                    mob.level.tell(distance)
                    if(mob.getNavigation().isStuck()){
                        mob.getNavigation().stop()
                    } 
                    if(distance <= 1.5){
                    // if(mob.getNavigation().isDone()){
                        mob.attack(mob.maxHealth * 0.2)
                        blockList[0].set("air")
                    }else{
                        // mob.level.tell(mob.getAttributeValue("minecraft:generic.movement_speed"))
                        // mob.getNavigation().stop()
                    }
                }
            }catch(e){
                console.log(e)
            }
            return true
        },
    )
})

// /**
//  * 
//  * @param {Internal.Mob} mob 
//  * @param {string} blockId 
//  * @param {number} range 
//  */
// function mobFindNearTargetBlock(mob, blockId, range){
//     let blockList = FindNearBlocks(mob, range, 5, 0, (block) => {
//         return block.id == blockId
//     })
//     if(blockList.length > 0){
//         mob.getNavigation().stop()
//         mob.getNavigation().moveTo(blockList[0].x, blockList[0].y + 1, blockList[0].z, 0.75)
//     }
//     return blockList
// }