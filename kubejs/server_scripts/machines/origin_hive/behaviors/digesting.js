/**
 * 
 * @param {fr.frinn.custommachinery.common.integration.kubejs.function_.Context} ctx 
 * @param {number}
 */
function Digesting(ctx, frequence){
    if (ctx.block.level.getDayTime() % frequence != 0) return new CustomMachineryData().build()
    let block = ctx.block
    let level = block.level
    let data = ctx.machine.data.get('originHiveData')
    let result = new CustomMachineryData().readNBT(data)

    let honeys = FindBlock(block.pos, 2, (x, y, z) =>{return level.getBlock(x, y, z).id == "kubejs:drone_cell"}, (x, y, z) => {return level.getBlock(x, y, z).id == "minecraft:honey_block"})

    if (honeys.length <= 0){
        result.pushInfo('无蜂蜜源！')
    }
    else {
        let target = honeys[Math.floor(Math.random() * honeys.length)]
        level.setBlock(NBT2Pos(target), Block.getBlock('kubejs:beeswax_block').defaultBlockState(), 2)
        ctx.machine.addFluidToTank('honey_store', Fluid.of("forestry:honey", 100), false)
        result.delInfo('无蜂蜜源！')
        result.success()
    }
    ctx.machine.data.put('originHiveData', result.build())
    return result.build()
}