// let utils=require('./utils');
let parseApis = require('./parse/apis');
let parseStream = require('./parse/stream');
let parseCommand = require('./parse/commands');
/* 
  command actions
*/
let authCommandAction=require('./commands/auth');
let configCommandAction=require('./commands/config');
let connectCommandAction=require('./commands/connect');
let deauthCommandAction=require('./commands/deauth');
let disconnectCommandAction=require('./commands/disconnect');
// let feedbackCommandAction=require('./commands/feedback');
let meetCommandAction=require('./commands/meet');
let setConfigCommandAction=require('./commands/setConfig');
let thirdAuthCommandAction=require('./commands/thirdAuth');
let webhooksCommandAction=require('./commands/webhooks');
let thirdApiCommandAction=require('./commands/thirdApi');
let configNotificationsCommandAction=require('./commands/notifications');
let setNotificationsCommandAction=require('./commands/setNotifications');
let notificationInfoCommandAction=require('./commands/notificationInfo');
let userconfigCommandAction=require('./commands/userconfig');
let setUserConfigCommandAction=require('./commands/setUserConfig');
/* command over */
let commandActions = {
  auth:authCommandAction,
  config:configCommandAction,//command
  connect:connectCommandAction,//command
  deauth:deauthCommandAction,
  disconnect:disconnectCommandAction,//command
  // feedback:feedbackCommandAction,
  thirdApi:thirdApiCommandAction,
  meet:meetCommandAction,//command
  setConfig:setConfigCommandAction,
  thirdAuth:thirdAuthCommandAction,
  webhooks:webhooksCommandAction,
  notifications:configNotificationsCommandAction,//command
  setNotifications:setNotificationsCommandAction,
  notificationInfo:notificationInfoCommandAction,
  userconfig:userconfigCommandAction,
  setUserConfig:setUserConfigCommandAction
};

let createApiMap=require('./createApiMap');
let getService=require('./getService');
let configUrl=require('./configUrl');

let createDb=require('./db');

let runApi=({botConfig,router})=>{
  
  let {services,models} = getService(botConfig);
  let apiRoutes=createApiMap(services);

  let dbInfo = createDb(botConfig,models);
  let apisInfo = parseApis(botConfig);
  let streamInfo = parseStream(botConfig);
  let commandInfo = parseCommand(botConfig);

  //change command name to other alias
  for (let i = 0; i < commandInfo.length; i++)
  {
    //callback action in commandInfo
    if ("callback" in commandInfo[i])
    {
      commandName = commandInfo[i].command.toString();
      commandActions[commandName] = commandActions[commandInfo[i].callback.toString()];
    }
  }
  
  // let apiCommand={regexp:/command/,key:'command',middles:[services.check,services.webhookMiddle]};
  
  configUrl.configRoutes({router,commandActions,streamInfo,dbInfo,apisInfo,apiRoutes:apiRoutes});
  configUrl.configCommandRoute({router,commandActions,streamInfo,dbInfo,apiRoutes:apiRoutes,apisInfo});


};

module.exports=runApi;