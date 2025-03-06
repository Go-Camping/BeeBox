//这是一个NBT处理工具，用于快速处理林业蜜蜂相关的NBT
//注：因林业诡异的NBT处理方式，使用kjs代码直接替换物品NBT无法生效，只能用Item重新构建物品并给与才能生效
function BeeNBT(){
    this.NBT = new $CompoundTag()
}

BeeNBT.prototype = {
    readNBT : function (tag){
        this.NBT = tag
        return this
    },
    setHealth : function(number){
        this.NBT.get('ForgeCaps').get('Parent').putInt('health', number)
        return this
    },
    setAnalyzed : function(boolean){
        this.NBT.get('ForgeCaps').get('Parent').putBoolean('analyzed', boolean)
        return this
    },
    isAnalyzed : function(){
        return this.NBT.get('ForgeCaps').get('Parent').getBoolean('analyzed')
    },
    getSpeed : function(){
        /**@type {Internal.CompoundTag} */
        let speed = this.NBT.get('ForgeCaps').get('Parent').get('genome').get('forestry:speed')

        return [parseFloat(speed.getString('active').split(':')[1]), parseFloat(speed.getString('inactive').split(':')[1])]
    },
    getFertility : function(){
        /**@type {Internal.CompoundTag} */
        let fertility = this.NBT.get('ForgeCaps').get('Parent').get('genome').get('forestry:fertility')
        return [parseInt(fertility.getString('active').split(':')[1]), parseInt(fertility.getString('inactive').split(':')[1])]
    },
    getHealth : function(){
        return this.NBT.get('ForgeCaps').get('Parent').getInt('health')
    },
    build : function(){
        return this.NBT
    }

}