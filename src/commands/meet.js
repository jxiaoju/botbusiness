let db = require('../db');
let utils = require('../utils');
let addSeconds = require('date-fns/add_seconds');


let meet = (option,dbInfo) =>
  async function(req, res) {
    let { models, webhookId, appLevel, shortcutItem ,accountUserId} = dbInfo;
    let { zoomApp, zoomWebhook } = res.locals;
    let { type, data, command, payload } = zoomWebhook;
    let { toJid: to_jid, userId, accountId: account_id, name } = payload;

    try {
      let item = await models.zoom.get(
        shortcutItem.zoom.get(
          {
            zoom_account_id: account_id,
            zoom_user_id: accountUserId,
            zoom_user_type: 'account'
          },
          appLevel
        )
      );
        
      if(!item){
        if(option.warnMessage){
          await zoomApp.sendMessage({
            to_jid,
            account_id,
            body: utils.transformBody(option.warnMessage.body, { body: 'Cannot find Zoom account' }),
            header: utils.transformHeader(option.warnMessage.header, { header: 'Error' })
          });
        }
        return;
      }


      //get access_token,refresh_token and config
      zoomApp.auth.setTokens({
        access_token: item.get('zoom_access_token'),
        refresh_token: item.get('zoom_refresh_token'),
        expires_date: item.get('zoom_expires_date')
      });

      //store access_token again
      zoomApp.auth.callbackRefreshTokens(async function(tokens){
        
        try{
          let acc=await models.zoom.update({
            uuid:item.get('uuid'),
            zoom_refresh_token:tokens.refresh_token,
            zoom_access_token:tokens.access_token,
            zoom_expires_date:addSeconds(new Date(),Math.floor((tokens.expires_in*3)/4))
          });
        }
        catch(e){
          console.log(e);
        }
      });

      let meetingInfo = await zoomApp.request({
        url: `/v2/users/${userId}/meetings`,
        method: 'post',
        header: { 'content-type': 'application/json' },
        body: {
          topic: `New ${process.env.app} Meeting`,
          type: 2,
          settings: {
            host_video: true,
            participant_video: true,
            join_before_host: true,
            enforce_login: true,
            mute_upon_entry: true
          }
        }
      });
  
      await zoomApp.sendMessage({
        to_jid,
        account_id,
        body: utils.transformBody(option.successMessage.body, meetingInfo),
        header: utils.transformHeader(option.successMessage.header, meetingInfo)
      });

    } catch (e) {
      console.log(e);
      let errorMessage = 'server error';
      await zoomApp.sendMessage({
        to_jid,
        account_id,
        body: utils.transformBody(option.errorMessage.body, { error: errorMessage }),
        header: utils.transformHeader(option.errorMessage.header, { error: errorMessage })
      });
    }
  };

module.exports = meet;
