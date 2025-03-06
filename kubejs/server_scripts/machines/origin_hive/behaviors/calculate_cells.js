/**
 * 
 * @param {fr.frinn.custommachinery.common.integration.kubejs.function_.Context} ctx 
 * @param {number}
 */
function Cells(ctx, frequence){
    if (ctx.block.level.getDayTime() % frequence != 0) return new CustomMachineryData().build()
    let block = ctx.block
    let level = block.level
    let data = ctx.machine.data.get('originHiveData')
    let result = new CustomMachineryData().readNBT(data)
    if (!result.data.contains('droneCells') ){
        result.data.put('droneCells', [])
    }
    if (!result.data.contains('storeCells') ){
        result.data.put('storeCells', [])
    }

    let droneCells = TestIn(block.pos.offset(-1, -1, -1), block.pos.offset(1, 1, 1), (x, y, z) =>{return level.getBlock(x, y, z).id == 'kubejs:drone_cell'})

    if (result.data.get('droneCells').length != droneCells.length){
        for (var i = 1; i <= 8; i++){
            if (i > droneCells.length){
                ctx.machine.setItemStored(`drone_cell_${i + 1}`, Item.of("minecraft:air"))
                ctx.machine.lockSlot(`drone_cell_${i + 1}`)
                
            }
            else{
                ctx.machine.unlockSlot(`drone_cell_${i + 1}`)
            }
            
        }
    }
    let storeCells = FindBlock(block.pos, 2, (x, y, z) =>{return level.getBlock(x, y, z).id == "kubejs:drone_cell"}, (x, y, z) =>{return level.getBlock(x, y, z).id == 'kubejs:store_cell'})
    if (result.data.get('storeCells').length != storeCells.length){
        result.data.put('storeCells', storeCells)
        for (var i = 1; i <= 9; i++){
            if (i > storeCells.length){
                ctx.machine.setItemStored(`store_${i}`, Item.of("minecraft:air"))
                ctx.machine.lockSlot(`store_${i}`)
                
            }
            else{
                ctx.machine.unlockSlot(`store_${i}`)
            }
            
        }
    }
    
    result.data.put('droneCells', droneCells)

    result.success()
    ctx.machine.data.put('originHiveData', result.build())
    return result.build()
}

