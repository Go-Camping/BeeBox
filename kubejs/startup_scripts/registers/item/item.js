
StartupEvents.registry("item", event => {
    event.create("kubejs:shop_order", "basic" )
        .texture("minecraft:item/paper")

    event.create("kubejs:debugger", "basic" )
        .texture("minecraft:item/stick")

    event.create("kubejs:nesting_order", "basic" )
        .texture("minecraft:item/honeycomb")
        .maxDamage(10)
})
