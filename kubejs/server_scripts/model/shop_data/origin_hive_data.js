function CustomMachineryData(){
    this.result = true
    this.data = new $CompoundTag()
    this.data.put('logs', [])
}

CustomMachineryData.prototype = {
    success : function(){
        this.result = true
        return this
    },
    error : function(string){
        this.result = false
        this.data.putString('error', string)
        return this
    },
    pushInfo : function(string){
        let logs = this.data.get('logs')
        if (logs.findIndex(log=>{return log == string}) != -1) return this
        logs.push(string)
        this.data.put('logs', logs)
        return this
    },
    delInfo : function(string){
        let logs = this.data.get('logs')
        logs = logs.filter(log =>{return log != string})
        this.data.put('logs', logs)
        return this
    },
    setData : function(tag){
        this.data = tag
        return this
    },
    readNBT : function(tag){
        let newData = new CustomMachineryData()
        if (tag == null) return newData
        newData.result = tag.getBoolean('result')
        newData.data = tag.get('data')
        return newData
    },
    build : function(){
        let tag = new $CompoundTag()
        tag.putBoolean('result', this.result)
        tag.put('data', this.data)
        return tag
    }
}