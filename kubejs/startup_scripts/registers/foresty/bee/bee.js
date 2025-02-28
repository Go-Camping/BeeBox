
/**
 * 蜜蜂模型
 * @param {string} Id 
 */
function beeModel(Id){
    //该种群的注册Id
    this.Id = Id
    //用于区分蜜蜂的大类
    this.genus = 'apis'
    //该蜜蜂显示的种类名
    this.species = 'defaultSpecies'
    //基因显隐性
    this.dominant = false
    this.color = Color.RED
    //注册染色体
    this.genomes = []
    this.produce = []
    this.mutations = []
}

beeModel.prototype = {
    /**
     * 该机制未研究完善，建议用默认的
     * @param {string} genus 
     */
    setGenus : function(genus){
        this.genus = genus
        return this
    },
    /**
     * @param {string} species 
     */
    setSpecies : function(species){
        this.species = species
        return this
    },
    setDominant : function(boolean){
        this.dominant = boolean
        return this
    },
    /**
     * 
     * @param {Internal.ItemStack} itemStack 
     * @param {number} weight 
     */
    addProduce : function(itemStack, weight){
        this.produce.push({
            "weight" : weight,
            "itemStack" : itemStack
        })
        return this
    },
    /**
     * 
     * @param {ResourceLocation} specieA 
     * @param {ResourceLocation} specieB 
     * @param {number} chance 
     */
    addMutation : function(specieA, specieB, chance){
        this.mutations.push({
            "specieA" : specieA,
            "specieB" : specieB,
            "chance" : chance
        })
        return this
    },
    /**
     * 注册染色体
     * @param {Internal.Consumer_<Internal.IGenomeBuilder>} genome 
     */
    registerGenomes : function(genome){
        this.genomes.push(genome)
        return this
    }
}


