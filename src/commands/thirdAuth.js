let db = require('../db');
let utils = require('../utils');

let thirdAuth = (option={},dbInfo) =>
  async function(req, res) {
    let { models, webhookId, appLevel, shortcutItem, accountUserId, thirdPartProps={} } = dbInfo;
    let packageFunction = utils.handlePackage(option.package, 'handleOauth');
    if(typeof packageFunction!=='function'){return;}

    let msg = await packageFunction({request:req,response:res});
    
    try {
      let { message, uuid } = msg;
      let usefullMsg={};
      if(typeof message==='object'){
        for(let key in message){
          if(thirdPartProps.indexOf(key)!==-1){
            usefullMsg[key]=message[key];
          }
        }
      }

      let acc = 0;
      if (uuid && Object.keys(usefullMsg).length>0) {
        acc = await models.zoom.update({
          uuid,
          ... message 
        });
      }
      else{
        throw new Error('Nothing received from 3rd oauth');

      }

      let WebHookId=acc.get(webhookId);
      if (!WebHookId)
      {
        throw new Error('Error while authenticating');
      }
      WebHookId = utils.createUuid(WebHookId);
      if (option.redirect.success) {
        res.redirect(`${process.env.zoomRedirect_uri}${option.redirect.success}/${uuid}/${WebHookId}`);
        return;
      }
    } catch (e) {
      console.log(e);
      res.redirect(
        `${process.env.zoomRedirect_uri}${
          option.redirect.error
        }?errorCode=500&errorMessage=server error`
      );
    }
  };

module.exports = thirdAuth;
