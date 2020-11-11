const projectService = require('./project');
const Member = require('../model/member');

function addMember(projectId, name, email, role) {
    return new Promise((resolve, reject) => {
        projectService.getProjectByID(projectId)
            .then((project) => {
                if (!project)
                    reject();

                const randomColor = Math.floor(Math.random()*16777215).toString(16);
                const member = new Member({
                    name: name,
                    email: email,
                    role: role,
                    color: randomColor
                });

                project.members.push(member);
                project.save(resolve());
            })
            .catch((err) => {
                reject(err);
            });
    });
}

function getMemberById(memberId) {
        return new Promise((resolve, reject) => {
            Member.findById(memberId, (err, project) => {
                if (err)
                    reject(err);
                else
                    resolve(project);
            });
        });
}

function deleteMember(projectId, memberId) {
    return new Promise((resolve, reject) => {
        projectService.getProjectByID(projectId)
            .then((project) => {
                if (!project)
                    reject();

                project.members.pull({ _id: memberId });
                project.save(resolve());
            })
            .catch((err) => {
                reject(err);
            });
    });
}



module.exports = { addMember, getMemberById, deleteMember };
