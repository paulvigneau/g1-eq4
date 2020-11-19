const projectService = require('./project');
const Member = require('../model/member');
const nodeMailer = require('nodemailer');

function sendEmailToMember(projectId, memberName, memberEmail, memberRole){
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'cdpproject33@gmail.com',
            pass: 'cdpscrum'
        }
    });

    projectService.getProjectByID(projectId)
        .then((project) => {
            if(project) {
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

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            }
        })
        .catch((err) => console.log(err));
}

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
                project.save()
                    .then((project) => resolve(project))
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
                    resolve(project.members.find(m => m._id.toString() === memberId.toString()));
                }
                else
                    reject();
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
                    reject();

                project.members.pull({ _id: memberId });
                project.save()
                    .then((project) => resolve(project))
                    .catch((err) => reject(err));
            })
            .catch((err) => {
                reject(err);
            });
    });
}

module.exports = { addMember, getMemberById, deleteMember, sendEmailToMember };
