// var dynogels = require('dynogels');
const Joi = require('@hapi/joi');

let typeMap = {
  // "Uuid":Joi.string(),
  String: Joi.string(),
  Date: Joi.date()
};

let defaultZoomDb = {
  uuid: Joi.string(),
  zoom_account_id: Joi.string(),
  zoom_user_id: Joi.string(),
  zoom_origin_user_id:Joi.string(),
  zoom_user_type: Joi.string(),
  zoom_access_token: Joi.string(),
  zoom_refresh_token: Joi.string(),
  zoom_expires_date:Joi.date(),
  zoom_expires_in:Joi.number()
};


let defaultWebhookDb = {
  uuid: Joi.string(),
  zoom_account_id: Joi.string(),
  zoom_user_id: Joi.string(),
  zoom_user_id_uuid:Joi.string(),
  zoom_channel_id: Joi.string(),
  zoom_channel_name: Joi.string(),
  zoom_channel_type: Joi.string(),
  zoom_channel_data: Joi.string()
};

let defaultRelationshipDb = {
  zoom_account_id: Joi.string(),
  zoom_user_id: Joi.string(),
  uuid: Joi.string()
}

// resource:{extend:{newrelic_id:'string'},webhookIdFrom:'zoom_account_id'}

let run = opt => {
  let { resource,db, appLevel } = opt;
  let zoomOtherProps={},webhookId='';
  if(resource){
    zoomOtherProps=resource.extend||{};
    webhookId=resource.webhookIdFrom;
  }
  else if(db){
    zoomOtherProps=db.zoom||{};
    webhookId=db.webhook.webhookId;
  }
  
  for (let key in zoomOtherProps) {
    defaultZoomDb[key] = typeMap[zoomOtherProps[key]];
  }

  // let { webhookId: _webhookId } = webhook;
  defaultWebhookDb[webhookId] = Joi.string();

  let dbConfig = {
    webhookId,
    appLevel,
    thirdPartProps: Object.keys(zoomOtherProps),
    schemas: {
      zoom: defaultZoomDb,
      webhook: defaultWebhookDb,
      relationship: defaultRelationshipDb
    }
  };
  return dbConfig;
};

module.exports = run;
