let parseDb = require('../parse/db');
let shortcutItem=require('./shortcutItem');
let relationshipTable=require('./relationshipTable');
module.exports=function(botConfig,models){
  let dbInfo = parseDb(botConfig);
  let { webhookId,thirdPartProps, appLevel } = dbInfo;


  let saveRelationShip=relationshipTable.saveRelationShip(models);
  let queryRelationShip=relationshipTable.queryRelationShip(models);
  //let queryRelationShip=queryRelationShipWrap(models);
  //let 

  return { models: models, webhookId, thirdPartProps, appLevel,shortcutItem,accountUserId:'account', saveRelationShip, queryRelationShip };
};


