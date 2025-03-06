ServerEvents.recipes(event => {
    event.remove({output: "forestry:bee_house"})

    event.shapeless(Item.of('kubejs:royal_jelly_crystal', 4),[
        "kubejs:royal_jelly_crystal_block"
    ])

    event.shapeless(Item.of("minecraft:honey_block", 1),[
        'kubejs:beeswax_block', "forestry:honey_drop"
    ])

    event.shapeless(Item.of("forestry:beeswax", 9),[
        'kubejs:beeswax_block'
    ])

    event.shaped(Item.of('kubejs:beeswax_block'), [
        'iii',
        'iii',
        'iii'
    ],{
        "i": "forestry:beeswax"
    })

    event.shaped(Item.of('forestry:bee_house', 1), [
        "###",
        "ERE",
        "EEE"
    ],{
        "R": "kubejs:royal_jelly_crystal_block",
        "#": '#minecraft:wooden_slabs',
        "E": '#minecraft:planks'
    })
})