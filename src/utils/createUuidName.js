let createUuidName=(uuidKeys,data)=>{
    let keyStrings='';
    for(let k of uuidKeys){
        if(k in data){
            keyStrings+=data[k];
        }
        else{
            return false;
        }
    }
    return keyStrings;
};


module.exports=createUuidName;