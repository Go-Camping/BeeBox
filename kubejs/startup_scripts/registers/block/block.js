StartupEvents.registry('block', event => {
    event.create('kubejs:beehive')
        .hardness(-1)

    event.create('kubejs:bee_shop', "custommachinery")
        .machine("kubejs:bee_shop")
        
})