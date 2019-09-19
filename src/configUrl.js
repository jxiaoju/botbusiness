let useGlobalMiddle=(condition,middle,value)=>{
  if(['function','object'].indexOf(typeof condition)!==-1){
    return [middle(value)];
  }
  else{
    return [];
  }
};


let configRoutes=({router,commandActions,streamInfo,dbInfo,apiRoutes,apisInfo})=>{
  let {apiMap,backMiddle,receiveMiddle}=apiRoutes;

    for (let apiItem of apisInfo) {
      let { url, method = 'get' ,back,receive} = apiItem;
      for(let itemMap of apiMap){
        let {regexp,middles,key}=itemMap;
        if(url.match(regexp)){
          if(key==='command'){//command is internal command
            // commandApi = apiItem;
          }
          else{
            // console.log(method,url,789);
            router[method](
              `/${url}`,
              ...useGlobalMiddle(receive,receiveMiddle,apiItem),
              ...middles.map((mid)=>{return mid(apiItem);}),
              ...useGlobalMiddle(back,backMiddle,apiItem),
              commandActions[key](streamInfo[key],dbInfo)
            );
          }
          break;
        }
      }
    }
    
  };
  
  
  let configCommandRoute=({router,commandActions,streamInfo,dbInfo,apiRoutes,apisInfo})=>{
    let {commandMap,backMiddle,receiveMiddle}=apiRoutes;
    let apiItem=null;

    for(apiItem of apisInfo){
      if(apiItem.url==='command'){
        break;
      }
    }
    let { url, method = 'get' ,back,receive} = apiItem;
    // create command
    router[method](
      `/${url}`,
      ...useGlobalMiddle(receive,receiveMiddle,apiItem),
      ...commandMap.middles.map((mid)=>{return mid(apiItem)}),
      ...useGlobalMiddle(back,backMiddle,apiItem),
      async (req, res) => {
        let { zoomWebhook } = res.locals;
        let { command } = zoomWebhook;
        // command=utils.lowercase(command);
        //only map in stream will be do
        if (command in streamInfo && command in commandActions) {
          await commandActions[command](streamInfo[command],dbInfo)(req, res);
        }
        res.send('ok');
      }
    );
  };


module.exports = {
  configCommandRoute,
  configRoutes
};