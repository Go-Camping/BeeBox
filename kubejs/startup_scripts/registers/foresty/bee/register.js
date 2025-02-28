ForestryEvents.apiculture(event=>{
    for (var id in bees){
        let builder = event.registerSpecies(new ResourceLocation('kubejs', id), bees[id].genus, bees[id].species, bees[id].dominant, bees[id].color)
        bees[id].genomes.forEach(genome =>{
            builder = builder.setGenome(genome)
        })
        bees[id].produce.forEach(pd => {
            builder.addProduct(pd.itemStack, pd.weight)
        })
        bees[id].mutations.forEach(mutation => {
            builder.addMutations((reg) => {
                reg.add(mutation.specieA, mutation.specieB, mutation.chance)
            })
        })
        // todo: 工作花类型注册
        // event.registerFlowerType()
    }
})


/**
 * 待注册的蜜蜂
 * @constant
 * @type {Object<string,beeModel>}
 */
const bees = {
    'example_specie': new beeModel('example_specie')
        .setGenus('apis').setSpecies('mySpecies').setDominant(true)
        //通过此处可以快捷为物种附加效果，特性等基因，可以用列表批量添加
        .registerGenomes(ctx =>{
            ctx.set(BeeChromosomes.EFFECT, effectAlleles['example_alleles'])
        }),
    "weakness_specie": new beeModel("weakness_specie")
        .setGenus("apis").setSpecies("weaknessSpecies").setDominant(true)
        .addProduce(Item.of("minecraft:dirt", 1), 0.5)
        // .registerGenomes(ctx => {
        //     ctx.set(BeeChromosomes.EFFECT, effectAlleles["weakness_alleles"])
        // }),
}
