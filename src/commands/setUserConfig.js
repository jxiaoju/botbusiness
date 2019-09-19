let utils = require('../utils');

let setUserConfig = (option,dbInfo) =>
  async function(req, res) {
    let { models, webhookId, appLevel, shortcutItem } = dbInfo;
    // console.log('received');

    let {id, message}=req.body;
    let optionKeys=option.keys;
    tempObj = {}
    for (let i = 0; i < optionKeys.length; i++){
      if (optionKeys[i] in message){
        tempObj[optionKeys[i]] = message[optionKeys[i]];
      }
    }
    // console.log('tempObj:',tempObj);
    let acc = await models.zoom.update({
      uuid: id,
      ... tempObj
    });
    res.send(200);
  };

module.exports = setUserConfig;