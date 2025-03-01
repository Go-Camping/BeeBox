// PlayerEvents.loggedIn(event => {
//     BeeBoxInit(event.level, event.player.blockPosition())
// })
LevelEvents.loaded(event => {
    console.log("Level loaded")
    let level = event.getLevel()
    BeeBoxInit(level)
    // todo: set初始蜂箱
})