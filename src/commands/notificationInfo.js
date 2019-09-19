let db = require('../db');
let utils = require('../utils');

let sendInfo = (option,dbInfo) => async function(req,res) {
  let { models, webhookId, appLevel, shortcutItem,accountUserId } = dbInfo;
  let {userid,hookid}=req.query;
  let info;

  // res.send({template:{

  //   project:{text:'project',ui:'input'},
  //   checkboxGroup:{text:'project',ui:'checkboxGroup',labels:[{key:'kogkey',text:'kog'},{key:'komkey',text:'loop select'}]},
  //   users:{text:'sel it',ui:'select',labels:[{key:'name',text:'name a'},
  //   {key:'value',text:'value a'}]}

  // },data:{
  //   project:'this is project'
  // }});

  try{
    info = await models.webhook.query({uuid:hookid});
    //can use uiConfig or keys
    let optionKeys=option.uiConfig||option.keys;
    let templateCollect={};
    let dataCollect={};
    let channelList=[];
    //get each item,and judge key same as optionKey


    for(let item of info.Items){
      if(item.get('zoom_user_id_uuid')===userid){

        let hookData=item.get('zoom_channel_data');
        let channelName=item.get('zoom_channel_name');
        let channelId=item.get('zoom_channel_id');
        channelList.push({key:channelId,text:channelName});
        hookData=hookData||{};

        let templateObject=templateCollect[channelId]={};
        let dataObject=dataCollect[channelId]={};

        for(let optionKeysItem of optionKeys){
          let {key}=optionKeysItem;
          let val=hookData[key];
          
          templateObject[key]=optionKeysItem;

          dataObject[key]=val;

          // if(val){
          //   templateCollect[key]=optionKeysItem;
          //   dataCollect[key]=val;
          // }
        }
      }
    }

    let channelInfo={ui:'select',key:'channelInfo',text:'select channel to config',labels:channelList};

    
    res.send({template:templateCollect,data:dataCollect,channelInfo});



  }
  catch(e){
    console.log(e);
    res.status(400).send('server error');
  }

};



module.exports = sendInfo;
