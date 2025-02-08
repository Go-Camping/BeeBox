ForestryEvents.apiculture(event=>{
    for (var id in bees){
        let builder = event.registerSpecies(new ResourceLocation('kubejs', id), bees[id].genus, bees[id].species, bees[id].dominant, bees[id].color)
        bees[id].genomes.forEach(genome =>{
            builder = builder.setGenome(genome)
        })
    }
})


/**
 * 待注册的蜜蜂
 * @constant
 * @type {Object<string,beeModel>}
 */
const bees = {
    'example_specie': new beeModel('example_specie').setGenus('apis').setSpecies('mySpecies').setDominant(true)
    //通过此处可以快捷为物种附加效果，特性等基因，可以用列表批量添加
    .registerGenomes(ctx =>{ctx.set(BeeChromosomes.EFFECT, effectAlleles['example_alleles'])})
}