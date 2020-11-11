let dbUtils = require('../dbUtils');
let objectId = dbUtils.getObjectId();
const projectModel = require('./project.js');

function addMember(projectId, name, email, role) {
    let dbo = dbUtils.getDb();

    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    let memberToAdd = {
        name: name,
        email: email,
        role: role,
        color: randomColor
    };

    dbo.collection('projects').update({'_id': new objectId(projectId)}, {$push: { members: memberToAdd }});

}



module.exports = { addMember };
