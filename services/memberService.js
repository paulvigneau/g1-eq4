const projectService = require('./projectService');
const emailService = require('./emailService');
const Member = require('../model/memberModel');
const { NotFoundError, BadRequestError } = require('../errors/Error');


function sendEmailToNewMember(projectId, name, email, role) {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;

    return new Promise((resolve, reject) => {
        projectService.getProjectByID(projectId)
            .then(async (project) => {
                if (!project)
                    return reject(new NotFoundError(`Project ${projectId} not found.`));

                emailService.sendEmail(
                    projectId,
                    email,
                    `Hey ${name}, vous avez été ajouté à un projet !`,
                    `Nous avons le plaisir de vous annoncer, très cher ${name}, que vous avez été ajouté au projet : ${project.name}, sous le rôle ${role}, et le ${today}.`
                )
                    .then(() => resolve())
                    .catch((err) => reject(err));
            })
            .catch((err) => {
                reject(err);
            });
    });
}

function addMember(projectId, name, email, role) {
    return new Promise((resolve, reject) => {
        projectService.getProjectByID(projectId)
            .then((project) => {
                if (!project)
                    return reject(new NotFoundError(`Project ${projectId} not found.`));

                const randomColor = Math.floor(Math.random()*16777215).toString(16);
                const member = new Member({
                    name: name,
                    email: email,
                    role: role,
                    color: randomColor
                });

                project.members.push(member);
                project.save()
                    .then(() => resolve(member))
                    .catch((err) => reject(err));
            })
            .catch((err) => {
                reject(err);
            });
    });
}

function getMemberById(projectId, memberId) {
    return new Promise((resolve, reject) => {
        projectService.getProjectByID(projectId)
            .then((project) => {
                if (project) {
                    resolve(project.members.id(memberId));
                }
                else
                    reject(new NotFoundError(`Project ${projectId} not found.`));
            })
            .catch((err) => {
                reject(err);
            });
    });
}

function deleteMember(projectId, memberId) {
    return new Promise((resolve, reject) => {
        projectService.getProjectByID(projectId)
            .then((project) => {
                if (!project)
                    return reject(new NotFoundError(`Project ${projectId} not found.`));

                if (!project.members.id(memberId))
                    return reject(new NotFoundError(`Member ${memberId} not found.`));

                const taskList = project.management.tasks;
                for(let i = 0; i < taskList.length; i++){
                    const task = taskList[i];
                    if(typeof task.member !== 'undefined') {
                        if (task.member.equals(memberId) && task.status === 'WIP') {
                            return reject(new BadRequestError(`Une tâche dans WIP contient déjà ce membre ${memberId}. Suppression du membre impossible.`));
                        }
                    }
                }

                project.members.id(memberId).remove();
                project.save()
                    .then((project) => resolve(project))
                    .catch((err) => reject(err));
            })
            .catch((err) => {
                reject(err);
            });
    });
}

module.exports = { addMember, getMemberById, deleteMember, sendEmailToNewMember };
