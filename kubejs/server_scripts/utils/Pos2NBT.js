/**
 * 
 * @param {BlockPos} blockPos 
 */
function Pos2NBT(blockPos){
    let NBT = new $CompoundTag()
    NBT.putInt('x', blockPos.x)
    NBT.putInt('y', blockPos.y)
    NBT.putInt('z', blockPos.z)
    return NBT
}

/**
 * 
 * @param {Internal.CompoundTag} NBT 
 */
function NBT2Pos(NBT){
    return new BlockPos(NBT.getInt('x'), NBT.getInt('y'), NBT.getInt('z'))
}