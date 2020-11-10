let dbUtils = require('../dbUtils');
let objectId = dbUtils.getObjectId();

function addMember(name, email, role, end) {
    let dbo = dbUtils.getDb();

    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    let projects = dbo.collection('projects');
    let memberList = projects.find('members');

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
