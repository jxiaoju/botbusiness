// let zoom = require('../services/zoom');
// 
let db=require('../db');
let utils = require('../utils');

// let utils = require('../utils');
// let { bot, auth, log } = zoom;
// let db=require('./dbfile')
// let {webhookId,appLevel}= db
let zoomRedirect_uri=process.env.zoomRedirect_uri;

let config = (option,dbInfo) => async function(req,res) {
  let {models,appLevel,shortcutItem,accountUserId,webhookId}=dbInfo;
  let {zoomApp, zoomWebhook}=res.locals
  let { type, data, command, payload } = zoomWebhook;
  let { toJid: to_jid, userId, accountId: account_id, name } = payload;


  try {


    let item = await models.zoom.get(shortcutItem.zoom.get({
      zoom_account_id: account_id,
      zoom_user_id:accountUserId,
      zoom_user_type: 'account',
      zoom_origin_user_id:userId
    },appLevel));

    if (userId !== item.get('zoom_origin_user_id') || type !== 'one')
    {
      if(option.warnMessage){
        await zoomApp.sendMessage({
          to_jid,
          account_id,
          body: utils.transformBody(option.warnMessage.body,{body: 'This command is only available on the admin/installer\'s 1 on 1 channel'}),
          header: utils.transformHeader(option.warnMessage.header,{header: 'Configuration'})
        });
      }
      return;
    }
    
    let WebHookId=item.get(webhookId);
    WebHookId = utils.createUuid(WebHookId);
    let uuid=item.get('uuid');
    
    let url=`${zoomRedirect_uri}${option.redirect.success}/${uuid}/${WebHookId}`;

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

module.exports = config;
