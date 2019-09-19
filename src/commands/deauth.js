// let db=require('../db');
let db = require('../db');
let utils = require('../utils');
// let { models, webhookId, shortcutItem, appLevel } = db;

// this is api action
let deauth = (option,dbInfo) =>
  async function(req, res) {
    let { models, webhookId, appLevel, shortcutItem ,accountUserId, queryRelationShip} = dbInfo;
    // let {zoomApp}=req.locals;
    let { payload } = req.body;

    let account_id, user_id;

    if (typeof payload === 'object') {
      account_id = payload.account_id;
      user_id = payload.user_id;
    }

    if (!account_id) {
      res.status(400).send('no account_id');
      return;
    }

    let relationships = await queryRelationShip(account_id, appLevel);
    
    
    if (relationships != null)
    {
      for (let i = 0; i < relationships.Count; i++)
      {
        try {
          let entryAccountId = relationships.Items[i].get('zoom_account_id');
          let entryUserId = relationships.Items[i].get('zoom_user_id');
          let relationshipEntry = await models.relationship.delete({zoom_account_id: entryAccountId, zoom_user_id: entryUserId});

          let TopLevelUUID = relationshipEntry.get('uuid');
          let topLevelEntry = await models.zoom.delete({uuid: TopLevelUUID});
          let WebHookId = topLevelEntry.get(webhookId);
          WebHookId = utils.createUuid(WebHookId);
          let webhooksList = await models.webhook.query({uuid: WebHookId});
          for (let j = 0; j < webhooksList.Count; j++)
          {
            let webhookuuid = webhooksList.Items[j].get('uuid');
            let webhookChannelId = webhooksList.Items[j].get('zoom_channel_id');
            await models.webhook.delete({uuid: webhookuuid, zoom_channel_id: webhookChannelId});
          }
        }
        catch(e){}

      }
      return;
    }

    try {
      //delete admin one item,this can only be account level
      
      let item = await models.zoom.delete({
        zoom_account_id: account_id,
        zoom_user_type: 'account'
      });

      //get bind third item
   
      let thirdpart_account_id = item.get(webhookId);
  
      
      let queryParams=shortcutItem.webhook.query({
        [webhookId]: thirdpart_account_id,
        zoom_user_id: user_id
      },appLevel,webhookId);
      let infos = await models.webhook.query(
        queryParams
      );

     
      //
      for (let info of infos.Items) {
        //loop all thirdpart bind infos , and then
        let webhook_zoom_account_id = info.get('zoom_account_id');
        let zoom_channel_id=info.get('zoom_channel_id');
        if (webhook_zoom_account_id === account_id) {
          await models.webhook.delete(
            shortcutItem.webhook.delete({
              [webhookId]: thirdpart_account_id,
              zoom_user_id:user_id,
              zoom_channel_id
            },appLevel,webhookId),
            { expected: { zoom_account_id: account_id } }
          );
        }
      }

      res.send('deauth success');

    } catch (e) {
      console.log(e);
      res.status(400).send('server error');

    }
  };

module.exports = deauth;
