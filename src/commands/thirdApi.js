let db = require('../db');
let utils = require('../utils');


let thirdAPI = (option,dbInfo) =>
  async function(req, res) {

    let {
      models,
      webhookId,
      appLevel,
      shortcutItem,
      accountUserId
    } = dbInfo;

    let {zoomApp, zoomWebhook}=res.locals;
    let { type, data, command, payload } = zoomWebhook;
    //get info from payload
    
    let { toJid: to_jid, userId, accountId: account_id, name } = payload;

    let packageFunction = utils.handlePackage(option.package, '');
    
    if(typeof packageFunction!=='function'){return;}

    try {

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

      let msg = await packageFunction({request:req,response:res,attrs:item.attrs});
      await zoomApp.sendMessage({
        to_jid,
        account_id,
        body: utils.transformBody(option.successMessage.body,{body: msg.body}),
        header: utils.transformHeader(option.successMessage.header,{header: msg.header})
      });
    }
    catch (e)
    {
      console.log(e);
      await zoomApp.sendMessage({
        to_jid,
        account_id,
        body: utils.transformBody(option.errorMessage.body,{body:e}),
        header: utils.transformHeader(option.errorMessage.header,{header:'Command Error'})
      });
    }
  };

module.exports = thirdAPI;