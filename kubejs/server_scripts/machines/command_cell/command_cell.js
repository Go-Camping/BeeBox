ServerEvents.recipes(event => {
    event.recipes.custommachinery.custom_machine("kubejs:command_cell", 20)
    .requireFunctionEachTick(ctx =>{
        GetGoods(ctx, 20)
        BuyGoods(ctx, 20)
        return ctx.success()
    })
})

