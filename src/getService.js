let botservice=require('../../botservice/src');
let {createServices,dbModels} =botservice;
//create db models
let parseDb =require('./parse/db');
let parseCommands=require('./parse/commands');


if(process.env.NODE_ENV==='local'){
  let port=process.env.dynamodbPort||8089;
  dbModels.setting({endpoint:`http://localhost:${port}`, region: process.env.tableRegion });
}
else{
  dbModels.setting({ region: process.env.tableRegion });
}

let getService=(botConfig)=>{

    let dbConfig=parseDb(botConfig);

    // console.log(991,dbConfig)
    let models=dbModels.create({
      appLevel:botConfig.appLevel,
      dbConfig:dbConfig,
      // schemas:dbConfig.schemas,
      tableName:{
        zoom:process.env[`zoomTable`],
        webhook:process.env[`webhookTable`],
        relationship:process.env['relationshipTable']
      },
      keyConfig:{
        relationship:{
          hash:'zoom_account_id',
          rangeKey:'zoom_user_id'
        },
        zoom:{
          hash:'uuid'
        },
        webhook:{
          hash:'uuid',
          range:'zoom_channel_id'
        }
      },
      uuidMap:{
          zoom:{
            account:['zoom_account_id','zoom_user_type'],
            user:['zoom_account_id','zoom_user_id','zoom_user_type']
          },
          webhook:{
            account:[dbConfig.webhookId],
            user:['zoom_user_id',dbConfig.webhookId]
          }
      }
    });

    let commandsInfo=parseCommands(botConfig);

    let services=createServices({
      commands:commandsInfo,
      config:{
        clientId:process.env.zoomClientId,
        clientSecret:process.env.zoomClientSecret,
        redirect_uri:process.env.zoomRedirect_uri+"/auth",
        verifyCode:process.env.zoomVerifyCode,
        botJid:process.env.zoomBotJid,
        app:process.env.app
      }
    });
    
    return {services,models};
};


module.exports=getService;