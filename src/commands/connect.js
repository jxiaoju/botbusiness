let db = require('../db');
let utils = require('../utils');

//this is a auto process

let connect = (option,dbInfo) =>
  async function(req, res) {
    let { models, webhookId, appLevel, shortcutItem,accountUserId } = dbInfo;
    let { zoomApp, zoomWebhook } = res.locals;
    let { type, data, command, payload } = zoomWebhook;
    let {
      toJid: to_jid,
      userId,
      accountId: account_id,
      channelName,
      name
    } = payload;

    try {
      //get account level  infos
      let acc = await models.zoom.get(
        shortcutItem.zoom.get(
          {
            zoom_account_id: account_id,
            zoom_user_id: userId,
            zoom_user_type: appLevel
          },
          appLevel
        )
      );

      if (acc === null)
      {
        await zoomApp.sendMessage({
          to_jid,
          account_id,
          body: utils.transformBody(option.errorMessage.body, {error: 'Could not connect to channel, try connecting your user using userconfig command first'}),
          header: utils.transformHeader(option.errorMessage.header, {})
        });
        return;
      }

      //try to get thirdpart id in zoom db,this is config by frontend page

      // get user user level id or account level id
      let WebHookId = acc.get(webhookId);

      //find whether have exited connect exit,if exit,send message warn,alreay have
      // let typePackage = typeof option.package;

      let packageFunction = utils.handlePackage(option.package, 'handleConnect');

      if (typeof packageFunction === 'function') {
        try {
          let item = await packageFunction({
            userId,
            accountId:account_id,
            scope: option.scope,
            attrs: acc.attrs
          });
          if ('webhookId' in item) {
            WebHookId = item.webhookId;
          }
        } catch (e) {
          console.log(e);
          return;
        }
      }

      if (WebHookId == null) {
        await zoomApp.sendMessage({
          to_jid,
          account_id,
          body: utils.transformBody(option.errorMessage.body, {
            error:
              'Did not find associated connection information, please make sure your account is linked'
          }),
          header: utils.transformHeader(option.errorMessage.header)
        });
        return;
      }

      let oneItem = await models.webhook.get(
        shortcutItem.webhook.get(
          {
            [webhookId]: WebHookId,
            zoom_user_id: userId,
            zoom_channel_id: to_jid
          },
          appLevel,
          webhookId
        )
      );

      //if have id ,already bind
      if (oneItem) {
        await zoomApp.sendMessage({
          to_jid,
          account_id,
          body: utils.transformBody(option.warnMessage.body, {}),
          header: utils.transformHeader(option.warnMessage.header, {})
        });
        return;
      }

      //bind success
      //use id to store in webhook db

      //whether only store 

      await models.webhook.save({
        [webhookId]: WebHookId,
        zoom_user_id: userId,
        zoom_user_id_uuid:utils.createUuid(userId),
        zoom_channel_id: to_jid,
        zoom_account_id: account_id,
        zoom_channel_name:channelName,
        zoom_channel_type:type

      });

      // send message tell you have sendmessage success
      await zoomApp.sendMessage({
        to_jid,
        account_id,
        body: utils.transformBody(option.successMessage.body, {
          name,
          channelName
        }),
        header: utils.transformHeader(option.successMessage.header, {
          name,
          channelName
        })
      });
    } catch (e) {
      console.log(e);
      await zoomApp.sendMessage({
        to_jid,
        account_id,
        body: utils.transformBody(option.errorMessage.body, {
          error: 'Problem connecting this channel'
        }),
        header: utils.transformHeader(option.errorMessage.header)
      });
    }
  };

module.exports = connect;
