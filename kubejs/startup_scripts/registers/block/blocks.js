StartupEvents.registry('block', event => {

    event.create("kubejs:royal_jelly_crystal_block")

    event.create('kubejs:beeswax_block', 'basic')
    .hardness(1)
    .noValidSpawns(true)
    .textureAll("minecraft:block/honeycomb_block")

    event.create('kubejs:drone_cell', 'basic')
    
    event.create('kubejs:store_cell', 'basic')

    event.create('kubejs:internal_cell', 'basic')

    event.create('kubejs:external_cell', 'basic')

    event.create('kubejs:hatch_cell', 'basic')

    // event.create()
})