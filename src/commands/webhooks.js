let db = require('../db');
let utils = require('../utils');

let webhooks = (option,dbInfo) =>
  async function(req, res) {
    let {
      models,
      webhookId,
      appLevel,
      shortcutItem,
      accountUserId
    } = dbInfo;
    let zoomApp = res.locals.zoomApp;


    let packageFunction = utils.handlePackage(option.package, 'identifyWebhook');
    if(typeof packageFunction!=='function'){return;}

    try{
    let msg = await packageFunction({request:req,response:res});
    if (!msg)
    {
      res.send(200);
      return;
    }
    let { message, uuid} = msg;
    let info = await models.webhook.query(
      { uuid }
    );
    let channels = info.Items;

    if (channels.length <= 0)
    {
      res.send(200);
      return;
    }

    let zoomAccount = await models.zoom.get(shortcutItem.zoom.get({
      zoom_account_id: channels[0].get('zoom_account_id'),
      zoom_user_id:'account',
      zoom_user_type: appLevel
    },appLevel));

    //this attr name is handleWebhook
    let packageFunctionWebhook = utils.handlePackage(option.package, 'handleWebhook');
    // if(typeof packageFunctionWebhook!=='function'){return;}

    if (typeof packageFunctionWebhook==='function'){
      let messageTemp = message;
      let retVal = await packageFunctionWebhook({request:req, response:res, attrs:zoomAccount.attrs, message:messageTemp, channels:info.Items});
      // console.log(retVal);
      message = retVal.message;
      channels = retVal.channels;
      if (!message)
      {
        console.log('No Message');
        res.send(200);
        return;
      }
    }

    //no need error message send,because it is a invalid info

    for (let item of channels) {
      let zoom_channel_id = item.get('zoom_channel_id');
      let zoom_account_id = item.get('zoom_account_id');
      
      let awaitmsg = await zoomApp.sendMessage({
        to_jid: zoom_channel_id,
        account_id: zoom_account_id,
        body: utils.transformBody(option.successMessage.body, {body: message.body}),
        header: utils.transformHeader(option.successMessage.header, {header: message.header})
      });
    }
    res.send(200);
  } catch(e){
    console.log(e);
    res.status(400).send('server error');
  } 
  };

module.exports = webhooks;
