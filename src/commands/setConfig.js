let db = require('../db');
let utils = require('../utils');

let setConfig = (option, dbInfo) =>
  async function(req, res) {
    let { models, webhookId, appLevel, shortcutItem, accountUserId } = dbInfo;

    let id = req.body.id;
    let saveData = req.body.data;
    //must have id,this id is account_id

    if (!id) {
      res.status(400).send('Requst Does Not Have Id');
      return;
    }

    try {
      //update config info
      let acc = await models.zoom.update({
        uuid: id,
        ...saveData
      });
      res.send('info config success');
    } catch (e) {
      res.status(400).send('config server error');
    }
  };

module.exports = setConfig;
