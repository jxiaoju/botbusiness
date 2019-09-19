let createApiMap=(services)=>{
    //api url
    let apiMap=[
      {regexp:/webhooks/,key:'webhooks',middles:[services.zoomAppMiddle]},
      {regexp:/^[\/]?auth/,key:'auth',middles:[services.zoomAuthMiddle]},
      {regexp:/^[\/]?deauth/,key:'deauth',middles:[services.zoomAppMiddle]},
      {regexp:/setConfig/,key:'setConfig',middles:[]},
      {regexp:/setNotifications/,key:'setNotifications',middles:[]},
      {regexp:/notificationInfo/,key:'notificationInfo',middles:[]},
      {regexp:/^[\/]?thirdAuth/,key:'thirdAuth',middles:[services.zoomAppMiddle]},
      {regexp:/setUserConfig/,key:'setUserConfig',middles:[]}
    ];

    let commandMap={regexp:/command/,key:'command',middles:[services.webhookMiddle]};

    let backMiddle=services.back;
    let receiveMiddle=services.receive;
    
    return {apiMap,commandMap,backMiddle,receiveMiddle};
};

module.exports=createApiMap;
