let dbUtils = require('../dbUtils');
let objectId = dbUtils.getObjectId();

function getAllSprints(id){
    return new Promise((resolve, reject) => {
        let dbo = dbUtils.getDb();
        dbo.collection('projects').findOne({ '_id': new objectId(id) }, function (err, result) {
            if (err){
                reject(err);
            }
            else{
                resolve(result.management.backlog);
            }
        })
    })
}

module.exports = { getAllSprints };
