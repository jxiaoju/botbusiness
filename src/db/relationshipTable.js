let saveRelationShip = (model)=>(data, appLevel)=>{
  return new Promise((resolve, reject) => {
    if (appLevel === 'account') resolve(null);
    else
    {
      model.relationship.model.create(data, function(err, acc) {
        if (err) {
          reject(err);
        } else {
          resolve(acc);
        }
      });
    }
  });
}

let queryRelationShip = (model) => (primaryKey, appLevel) => {
  return new Promise((resolve, reject) => {
    if (appLevel === 'account') resolve(null);
    else
    {
      model.relationship.model.query(primaryKey).exec(function(err, infos) {
        if (err) {
          reject(err);
        } else {
          resolve(infos);
        }
      });
    }
  });
}

module.exports = {saveRelationShip,queryRelationShip};