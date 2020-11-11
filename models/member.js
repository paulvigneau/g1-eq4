let dbUtils = require('../dbUtils');
let objectId = dbUtils.getObjectId();
const projectModel = require('./project.js');

function addMember(projectId, name, email, role) {
    let dbo = dbUtils.getDb();

    let test = new objectId;
    console.log(test.id);
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    let memberToAdd = {
        _id: new objectId(null),
        name: name,
        email: email,
        role: role,
        color: randomColor
    };

    dbo.collection('projects').update({'_id': new objectId(projectId)}, {$push: { members: memberToAdd }});

}

function getMemberById(memberId){
        return new Promise((resolve, reject) => {
            let dbo = dbUtils.getDb();
            dbo.collection('projects').findOne({ '_id': new objectId(memberId) }, function (err, result) {
                if (err){
                    reject(err);
                }else {
                    resolve(result);
                }
            });
        });
}

function deleteMember(projectId, memberId){
    let dbo = dbUtils.getDb();
    getMemberById(memberId).then(memberToDelete => {

        dbo.collection('projects').update({'_id': new objectId(projectId)}, {$pull: { members: memberToDelete }});
    });
}



module.exports = { addMember };
