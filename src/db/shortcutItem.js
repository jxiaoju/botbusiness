let webhookChange=(data, appLevel = 'account',webhookId)=>{
  if (appLevel === 'account') {

      return {
        [webhookId]: data[webhookId],
        zoom_channel_id:data.zoom_channel_id
      };
    } else {
      return {
          [webhookId]: data[webhookId],
          zoom_channel_id:data.zoom_channel_id,
      };
    }
};

let webhookChangeQuery=(data, appLevel = 'account',webhookId)=>{
  if (appLevel === 'account') {
      return {
        [webhookId]: data[webhookId]
      };
    } else {
      return {
          [webhookId]: data[webhookId],
      };
    }
};


let zoomChange=(data, appLevel = 'account') => {
  if (appLevel === 'account') {
    return {
      zoom_account_id: data.zoom_account_id,
      zoom_user_type: data.zoom_user_type
    };
  } else {
    return {
      zoom_account_id: data.zoom_account_id,
      zoom_user_id: data.zoom_user_id,
      zoom_user_type: data.zoom_user_type
    };
  }
};

let relationshipGet = (data, appLevel = 'account') =>
{
if (appLevel === 'account')
{
  return {
    zoom_account_id: null,
    zoom_user_id: null
  }
}
else
{
  return {
    zoom_account_id: data.zoom_account_id,
    zoom_user_id: data.zoom_user_id
  }
}
};

let relationshipQuery = (data, appLevel = 'account') =>
{
if (appLevel === 'account')
{
  return {
    zoom_account_id: null
  }
}
else
{
  return {
    zoom_account_id: data.zoom_account_id
  }
}
};

let shortcutItem = {
zoom: {
  get: zoomChange,
  save:zoomChange
},
webhook:{
  query:webhookChangeQuery,
  delete:webhookChange,
  get:webhookChange
},
relationship: {
  get:relationshipGet,
  query:relationshipQuery,
  save:relationshipGet
}
};

module.exports = shortcutItem;
