// let zoom = require('../services/zoom');
// let db = require('../db');
// let utils = require('../utils');
// let { bot, auth, log } = zoom;

let db = require('../db');
let utils = require('../utils');



let disconnect = (option,dbInfo) =>
  async function(req, res) {
    let { models, webhookId, appLevel, shortcutItem ,accountUserId} = dbInfo;
    let { zoomApp, zoomWebhook } = res.locals;
    let { type, data, command, payload } = zoomWebhook;
    let { toJid: to_jid, userId, accountId: account_id, name } = payload;
    
    try {
      //get account level  infos

      let item = await models.zoom.get(
        shortcutItem.zoom.get(
          {
            zoom_account_id: account_id,
            zoom_user_id: userId,
            zoom_user_type: appLevel
          },
          appLevel
        )
      );

      if (item === null)
      {
        await zoomApp.sendMessage({
          to_jid,
          account_id,
          body: utils.transformBody(option.errorMessage.body, {error: 'Could not connect to channel, try connecting your user using userconfig command first'}),
          header: utils.transformHeader(option.errorMessage.header, {})
        });
        return;
      }

      let packageFunction = utils.handlePackage(option.package, 'handleDisconnect');

      if (typeof packageFunction==='function') {
        try {
          await packageFunction({
            // zoom_user_id,
            // zoom_account_id,
            scope: option.scope,
            userId:zoom_user_id,
            accountId:zoom_account_id
          });
        } catch (e) {
          //
        }
      }

      //try to get thirdpart id in zoom db,this is config by frontend page
      let thirdpart_account_id = item.get(webhookId);

      let oneItem = await models.webhook.get(
        shortcutItem.webhook.get(
          {
            [webhookId]: thirdpart_account_id,
            zoom_user_id: userId,
            zoom_channel_id:to_jid
          },
          appLevel,
          webhookId
        )
      );

      if(!oneItem){
        await zoomApp.sendMessage({
          to_jid,
          account_id,
          body: utils.transformBody(option.warnMessage.body, {}),
          header: utils.transformHeader(option.warnMessage.header, {})
        });

        return;
      }


      //loop all thirdpart bind infos , and then
      let thirdpart_webhook_id = oneItem.get(webhookId);
      let zoom_channel_id = oneItem.get('zoom_channel_id');


      await models.webhook.delete(
        shortcutItem.webhook.delete(
          {
            [webhookId]: thirdpart_webhook_id,
            zoom_user_id: userId,
            zoom_channel_id
          },
          appLevel,
          webhookId
        ),
        { expected: { zoom_account_id: account_id } }
      );
       
   

      // send message tell you have sendmessage success
      await zoomApp.sendMessage({
        to_jid,
        account_id,
        body: utils.transformBody(option.successMessage.body, { name }),
        header: utils.transformHeader(option.successMessage.header, { name })
      });
    } catch (e) {
      console.log(e);
      await zoomApp.sendMessage({
        to_jid,
        account_id,
        body: utils.transformBody(option.errorMessage.body, { error: e }),
        header: utils.transformHeader(option.errorMessage.header, { error: e })
      });
    }
  };

module.exports = disconnect;
