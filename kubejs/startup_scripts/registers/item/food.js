StartupEvents.registry("item", event => {
    event.create("kubejs:clarity_royal_jelly")
    .food(builder => {
        builder.alwaysEdible().eaten(foodEvent => {
            // let player = foodEvent.player

        })
    })
})