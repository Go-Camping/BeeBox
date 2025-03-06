/**
 * 
 * @param {fr.frinn.custommachinery.common.integration.kubejs.function_.Context} ctx 
 * @param {number}
 */
function Works(ctx, frequence){
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

    if (result.data.get('internalCells').length > 0){
        let swax = FindBlock(block.pos, 2, (x, y, z) =>{return level.getBlock(x, y, z).id == "kubejs:drone_cell"}, (x, y, z) =>{return level.getBlock(x, y, z).id == 'kubejs:beeswax_block'})
        if (swax.length > 0){
            let target = swax[Math.floor(Math.random() * swax.length)]
            level.setBlock(NBT2Pos(target), Block.getBlock("minecraft:air").defaultBlockState(), 2)
            for (var i = 1; i <= 9; i++){
                if (!ctx.machine.isSlotLocked(`store_${i}`)){
                    if (ctx.machine.addItemToSlot(`store_${i}`, Item.of('kubejs:beeswax_block'), true).count <= 0){
                        ctx.machine.addItemToSlot(`store_${i}`, Item.of('kubejs:beeswax_block'), false)
                        break
                    }
                }
            }
            
            result.success()
        }
    }

    if (result.data.get('externalCells').length > 0){
        for (var j = 1; j <= result.data.get('externalCells').length; j++){
                for (var i = 1; i <= 9; i++){
                    if (!ctx.machine.isSlotLocked(`store_${i}`)){
                        if (ctx.machine.addItemToSlot(`store_${i}`, Item.of("minecraft:oak_log"), true).count <= 0){
                            ctx.machine.addItemToSlot(`store_${i}`, Item.of("minecraft:oak_log"), false)
                            break
                        }
                    }
                }
                
                result.success()
            }
    }

    return result.build()
}
