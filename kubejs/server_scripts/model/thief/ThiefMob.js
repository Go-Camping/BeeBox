/**
 * 
 * @param {Internal.Mob} mob 
 */
function ThiefMob(mob){
    this.mob = mob;

}
ThiefMob.prototype = {
    init : function(){
        this.mob.persistentData.put("desire", NBT.compoundTag())
    }
}