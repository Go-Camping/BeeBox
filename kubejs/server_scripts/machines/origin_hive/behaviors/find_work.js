/**
 * 
 * @param {fr.frinn.custommachinery.common.integration.kubejs.function_.Context} ctx 
 * @param {number}
 */
function FindWorks(ctx, frequence){
    if (ctx.block.level.getDayTime() % frequence != 0) return new CustomMachineryData().build()
    let block = ctx.block
    let level = block.level
    let data = ctx.machine.data.get('originHiveData')
    let result = new CustomMachineryData().readNBT(data)
    if (!result.data.contains('droneCells') ){
        result.data.put('droneCells', [])
    }
    if (!result.data.contains('internalCells') ){
        result.data.put('internalCells', [])
    }
    if (!result.data.contains('externalCells') ){
        result.data.put('externalCells', [])
    }
    if (!result.data.contains('commandCells') ){
        result.data.put('commandCells', [])
    }

    /**@type {BlockPos[]} */
    let droneCells = []
    result.data.get('droneCells').forEach(droneCell =>{
        droneCells.push(NBT2Pos(droneCell))
    })

    let internal = FindBlock(block.pos, 2, (x, y, z) =>{return level.getBlock(x, y, z).id == "kubejs:drone_cell"}, (x, y, z) =>{return level.getBlock(x, y, z).id == 'kubejs:internal_cell'})
    let external = FindBlock(block.pos, 2, (x, y, z) =>{return level.getBlock(x, y, z).id == "kubejs:drone_cell"}, (x, y, z) =>{return ((level.getBlock(x, y, z).id == 'kubejs:external_cell') && (NextToBlock(level, new BlockPos(x, y, z), "minecraft:air") > 2))})
    let command = FindBlock(block.pos, 2, (x, y, z) =>{return level.getBlock(x, y, z).id == "kubejs:drone_cell"}, (x, y, z) =>{return ((level.getBlock(x, y, z).id == 'kubejs:command_cell'))})

    result.data.put('internalCells', internal)
    result.data.put('externalCells', external)
    result.data.put('commandCells', external)

    result.success()
    ctx.machine.data.put('originHiveData', result.build())
    return result.build()


}