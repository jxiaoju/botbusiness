let db=require('../db');
let utils = require('../utils');
// let {models,appLevel,shortcutItem,accountUserId,webhookId}=db;
// let utils = require('../utils');
// let { bot, auth, log } = zoom;

let zoomRedirect_uri=process.env.zoomRedirect_uri;


let connect = (option,dbInfo) => async function(req,res) {
  let { models, webhookId, appLevel, shortcutItem,accountUserId } = dbInfo;
  let {zoomApp, zoomWebhook}=res.locals;
  let { type, data, command, payload } = zoomWebhook;
  let { toJid: to_jid, userId, accountId: account_id, name } = payload;
  try {
    
    // if (type !== 'one')
    // {
    //   if(option.warnMessage){
    //     await zoomApp.sendMessage({
    //       to_jid,
    //       account_id,
    //       body: utils.transformBody(option.warnMessage.body,{body: 'This command is only available on your 1 on 1 channel'}),
    //       header: utils.transformHeader(option.warnMessage.header,{header: 'Configuration'})
    //     });
    //   }
    //   return;
    // }

    //need to get webhookId in webhook table,

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
        body: utils.transformBody(option.warnMessage.body, {body: 'Could not connect to channel, try connecting your user using userconfig command first'}),
        header: utils.transformHeader(option.warnMessage.header, {header: 'Error configuring notifications'})
      });
      return;
    }


    let hookid=item.get(webhookId);

    let hookItems = await models.webhook.query(
      shortcutItem.webhook.query(
        {
          [webhookId]: hookid,
          zoom_user_id:userId
        },
        appLevel,
        webhookId
      )
    );

    // no connect
    if(hookItems.Items.length===0){
      await zoomApp.sendMessage({
        to_jid,
        account_id,
        body: utils.transformBody(option.warnMessage.body,{body:`Please use connect command on at least 1 channel before configuring notifications`}),
        header: utils.transformHeader(option.warnMessage.header,{header:'No Connected Channels'})
      });
      return;
    }   


    let WebHookUuid = utils.createUuid(item.get(webhookId));
    let useruuid = utils.createUuid(userId);
    
    let url=`${zoomRedirect_uri}${option.redirect.success}/${WebHookUuid}/${useruuid}`;


//accept
    await zoomApp.sendMessage({
      to_jid,
      account_id,
      body: utils.transformBody(option.successMessage.body,{url}),
      header: utils.transformHeader(option.successMessage.header,{url})
    });

  } catch (e) {
    console.log(e);
    await zoomApp.sendMessage({
      to_jid,
      account_id,
      body: utils.transformBody(option.errorMessage.body,{error:e}),
      header: utils.transformHeader(option.errorMessage.header,{error:e})
    });
  }
};

module.exports = connect;