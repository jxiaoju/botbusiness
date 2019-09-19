var template = require('es6-template-strings');
// var xss = require("xss");

let transformBody = (body, option={}) => {
  if (Object.keys(body).length === 0 && typeof option.body === 'object')
  {
    return option.body;
  }
  option=Object.assign({},option);
  // for(let key in option){
  //   option[key]=xss(option[key]);
  // }

  let bodyString = body;
  if (typeof body === 'object') {
    bodyString = JSON.stringify(body);
  }
  if (typeof option === 'object') {
    bodyString = template(bodyString, option);
  }
  return JSON.parse(bodyString);
};

//first these two method is same
let transformHeader = (header, option={}) => {
  if (Object.keys(header).length === 0 && typeof option.header === 'object')
  {
    return option.header;
  }
  option=Object.assign({},option);
  // for(let key in option){
  //   option[key]=xss(option[key]);
  // }
  let headerString = header;
  if (typeof header === 'object') {
    headerString = JSON.stringify(header);
  }
  if (typeof option === 'object') {
    headerString = template(headerString, option);
  }
  return JSON.parse(headerString);
};

module.exports = {
  transformBody,
  transformHeader
};
