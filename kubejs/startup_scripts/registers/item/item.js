
StartupEvents.registry("item", event => {
    event.create("kubejs:shop_order", "basic" )
        .texture("minecraft:item/paper")
        .maxStackSize(1)

    event.create("kubejs:debugger", "basic" )
        .texture("minecraft:item/stick")

    event.create("kubejs:nesting_order", "basic" )
        .texture("minecraft:item/honeycomb")
        .maxDamage(2)
        .maxStackSize(1)

    event.create("kubejs:box_structure_helper")
        .texture("minecraft:item/end_crystal")
        .maxStackSize(1)

    event.create("kubejs:royal_jelly_crystal", "basic" )
        .maxStackSize(64)

})
