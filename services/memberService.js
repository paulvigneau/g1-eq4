const projectService = require('./projectService');
const Member = require('../model/memberModel');
const nodeMailer = require('nodemailer');
const { NotFoundError, BadRequestError } = require('../errors/Error');


function sendEmailToMember(projectId, memberName, memberEmail, memberRole){
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'cdpproject33@gmail.com',
            pass: 'cdpscrum'
        }
    });

    return new Promise((resolve, reject) => {
        projectService.getProjectByID(projectId)
            .then((project) => {
                if (project) {
                    let today = new Date();
                    const dd = String(today.getDate()).padStart(2, '0');
                    const mm = String(today.getMonth() + 1).padStart(2, '0');
                    const yyyy = today.getFullYear();

                    today = dd + '/' + mm + '/' + yyyy;

                    const mailOptions = {
                        from: 'cdpproject33@gmail.com',
                        to: memberEmail,
                        subject: 'Hey ' + memberName + ', vous avez été ajouté à un projet !',
                        text: 'Nous avons le plaisir de vous annoncer, très cher ' + memberName + ', que vous avez été ajouté au projet : ' + project.name + ', sous le rôle ' +
                            memberRole + ', et le ' + today + '.'
                    };

                    transporter.sendMail(mailOptions, function (error) {
                        if (error)
                            reject(error);
                        else
                            resolve();
                    });
                }
            })
            .catch((err) => reject(err));
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

function getMemberByName(projectId, name){
    return new Promise((resolve, reject) => {
        projectService.getProjectByID(projectId)
            .then((project) => {
                project.members.findOne({ 'name': name }, (err, member) => {
                    if (err)
                        reject(new NotFoundError(`member ${name} not found.`));
                    else
                        resolve(member);
                });
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

module.exports = { addMember, getMemberById, deleteMember, sendEmailToMember, getMemberByName };
