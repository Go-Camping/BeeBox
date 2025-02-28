ServerEvents.recipes(event => {
    event.remove({output: "forestry:bee_house"})

    event.shapeless(Item.of('kubejs:royal_jelly_crystal', 4),[
        "kubejs:royal_jelly_crystal_block"
    ])

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