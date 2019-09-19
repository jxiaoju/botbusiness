let db = require('../db');
let utils = require('../utils');
// let { models, webhookId, appLevel, shortcutItem } = db;

let setNotifications = (option,dbInfo) =>
  async function(req, res) {
    let { models, webhookId, appLevel, shortcutItem,accountUserId } = dbInfo;
    let {userid,hookid,data,channelId}=req.body;
    let acc = await models.webhook.update({
      uuid: hookid,
      zoom_channel_id: channelId,
      zoom_channel_data: JSON.stringify(data)
    });
    res.send(200);
  };

module.exports = setNotifications;