let request = require('./request');
let createUuidName = require('./createUuidName');
let transformMessage = require('./transformMessage');
let handlePackage=require('./handlePackage');
let uuidv5 = require('uuid/v5');

let createUuid=function(id){return uuidv5(id,process.env.uuidNamespace);}
const parseSummary = function parseSummary(summary, appname) {
  let currApp = 0;
  for (let i = 0; i < summary.applications.length; i++) {
    if (summary.applications[i].name == appname) {
      currApp = summary.applications[i];
      break;
    }
  }
};

let getValueFromAttrs = (obj, attrs) => {
  if (typeof attrs !== 'string') {
    return obj;
  }
  let arr = attrs.split('.');
  let out = obj;
  for (let key of arr) {
    out = out[key];
  }
  return out;
};


const lowercase = (s) => {
  if (typeof s !== 'string') {return s;}
  if(!s){return s;}
  return s.charAt(0).toLowerCase() + s.slice(1)
};




let out = Object.assign(transformMessage, {
  lowercase,
  getValueFromAttrs,
  request,
  createUuidName,
  parseSummary,
  createUuid,
  handlePackage
});

module.exports = out;
