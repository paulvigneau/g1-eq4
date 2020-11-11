let dbUtils = require('../dbUtils');
let objectId = dbUtils.getObjectId();
const projectModel = require('project.js');

function addMember(projectId, name, email, role) {
    let dbo = dbUtils.getDb();

    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    let project = projectModel.getProjectByID(projectId);
    let memberList = project.members;

    let memberToAdd = {
        name: name,
        email: email,
        role: role,
        color: randomColor
    };

    memberList.push(memberToAdd, function (err, result) {
        if (err) throw err;
    });
}



module.exports = { addMember };
