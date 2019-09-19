let db = require('../db');
let utils = require('../utils');
//get db info

let addSeconds = require('date-fns/add_seconds');


let auth = (option,dbInfo) =>
  async function(req, res) {

    let { models, webhookId, accountUserId, appLevel, saveRelationShip } = dbInfo;
    // get zoomApp
    let { zoomApp } = res.locals;
    //get redirect url
    let zoomRedirect_uri = process.env.zoomRedirect_uri;
    
    try {
      //get user
      let userInfo = await zoomApp.getUser();
      let userId = userInfo.id;
      //this have oauth2 function
      let tokens = zoomApp.auth.getTokens();
      //need to get,and maybe cover item
      //store db
      //account level can save info
      //this can only store account level data

      let acc = await models.zoom.save({
        zoom_account_id: userInfo.account_id,
        zoom_user_id: accountUserId, //
        zoom_user_type: 'account',
        zoom_origin_user_id:userId,
        zoom_access_token: tokens.access_token,
        zoom_refresh_token: tokens.refresh_token,
        zoom_expires_date:addSeconds(new Date(),Math.floor((tokens.expires_in*3)/4))
      });

      
      let relationship = await saveRelationShip(
        {
          zoom_account_id: userInfo.account_id,
          zoom_user_id: accountUserId,
          uuid: acc.get('uuid')
        },
        appLevel
      );

      //get uuid info
      let WebHookId=acc.get(webhookId);
      WebHookId = utils.createUuid(WebHookId);
      let uuid = acc.get('uuid');
      //redirect info
      if (option.redirect.success) {

        

        res.redirect(`${zoomRedirect_uri}${option.redirect.success}/${uuid}/${WebHookId}`);
        //return;
      }

      let packageFunction = utils.handlePackage(option.package, 'GetOauthURL');

      if (typeof packageFunction === 'function'){
        let redirectUrl = await packageFunction({request:req, response:res, attrs:acc.attrs});
        res.redirect(redirectUrl);
      }
    } catch (e) {
      console.log(e);
      res.redirect(
        `${zoomRedirect_uri}${
          option.redirect.error
        }?errorCode=500&errorMessage=server error`
      );
    }
  };

module.exports = auth;
