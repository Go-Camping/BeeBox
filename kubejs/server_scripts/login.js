PlayerEvents.loggedIn(event => {
    BeeBoxPresetsWeightInit(event.level, event.player.blockPosition())
})