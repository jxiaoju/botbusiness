let handlePackage=(packageInfo,commandName)=>{
    let typePackage=typeof packageInfo;
    // let functionName='handle' + commandName.slice(0,1).toUpperCase()+commandName.slice(1);
    if(['function','object'].indexOf(typePackage)!==-1){
        let outFunc=packageInfo;
        if(typePackage==='object'){
            outFunc=packageInfo[commandName];
        }    
        if(typeof outFunc==='function'){
            return outFunc;
        }
        else{
            return false;
        }
    }
    else{
          return false;
    }
};




module.exports=handlePackage;