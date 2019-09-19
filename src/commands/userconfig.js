let db = require('../db');
let utils = require('../utils');
let zoomRedirect_uri=process.env.zoomRedirect_uri;

let userconfig = (option,dbInfo) =>
async function(req,res) {
  // console.log('hi hit here');
  let {
    models,
    webhookId,
    appLevel,
    shortcutItem,
    accountUserId,
    saveRelationShip
  } = dbInfo;

  let {zoomApp, zoomWebhook}=res.locals
  let { type, data, command, payload } = zoomWebhook;
  let { toJid: to_jid, userId, accountId: account_id, name, channelName } = payload;
  // let [scope]=data;
//get config url send messsage
  try {
// if(appLevel=='acoun'){get({})}
// else if(get)

    let item = await models.zoom.get(shortcutItem.zoom.get({
      zoom_account_id: account_id,
      zoom_user_id: userId,
      zoom_user_type: appLevel,
    },appLevel));
    
    if (item == null)
    {
      item = await models.zoom.save({
        zoom_account_id: account_id,
        zoom_user_id: userId,
        zoom_user_type: appLevel,
      });

      let relationship = await saveRelationShip({
        zoom_account_id: account_id,
        zoom_user_id: userId,
        uuid: item.get('uuid')
      },
      appLevel);
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

module.exports = userconfig;