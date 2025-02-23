// priority: 0

console.info('Hello, World! (Loaded startup scripts)')

// const $TreeChromosomes = Java.loadClass('forestry.api.genetics.alleles.TreeChromosomes')
// const $DefaultTreeSpecies = Java.loadClass('forestry.plugin.DefaultTreeSpecies')
const $IArboricultureRegistration = Java.loadClass('forestry.api.plugin.IArboricultureRegistration')
// const $ITreeSpeciesBuilder = Java.loadClass('forestry.api.plugin.ITreeSpeciesBuilder')

const $VanillaWoodType = Java.loadClass('forestry.arboriculture.VanillaWoodType')
const $ForestryWoodType = Java.loadClass('forestry.arboriculture.ForestryWoodType')

ForestryEvents.apiculture(event => {
    // event.registerSpecies()
    // // let treeRegister = new $IArboricultureRegistration
    // $IArboricultureRegistration.registerSpecies(new ResourceLocation("kubejs", "test_tree"), "quercus", "velutina", false, Color.BLUE, $VanillaWoodType.OAK)
    //     .addMutations((mutations) => {
    //         mutations.add(new ResourceLocation("forestry", "tree_larch"), new ResourceLocation("forestry", "tree_hill_cherry"), 0.1);
    //     })

    // $ITreeSpeciesBuilder
})
// ForestryEvents.genetics(event => {
//     event.
// })
// ForestryEvents.genetics()