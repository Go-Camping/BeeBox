PlayerEvents.loggedIn(event => {
    BeeBoxPresetsWeightRegistry(event.level, event.player.blockPosition())
})