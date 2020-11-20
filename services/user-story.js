const projectService = require('./project');
const UserStory = require('../model/user-story');
const Sprint = require('../model/sprint');
const Backlog = require('../model/backlog');

function addUS(projectId, sprintId, description, difficulty) {
    return new Promise((resolve, reject) => {
        projectService.getProjectByID(projectId)
            .then((project) => {
                if (!project)
                    reject();

                let newIncr = project.incrUS+1;
                project.incrUS = newIncr;

                const userStory = new UserStory({
                    id: newIncr,
                    description: description,
                    difficulty: difficulty,
                    priority: 0,
                    status: null,
                    parent: null
                });

                if(sprintId) {
                    getSprintByID(sprintId)
                        .then((sprint) => {
                            if (!sprint)
                                reject();
                            userStory.priority = sprint.USList.length;
                            sprint.USList.push(userStory);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                }else{
                    // Backlog section add
                    let backlog = project.management.backlog.backlog;
                    userStory.priority = backlog.USList.length;
                    backlog.USList.push(userStory);
                }
                project.save()
                    .then(() => resolve())
                    .catch((err) => reject(err));
            })
            .catch((err) => {
                reject(err);
            });
    });
}

function getAllUS(projectId, sprintId) {
    return new Promise((resolve, reject) => {
        getSprintByID(sprintId)
            .then((sprint) => {
                if (sprint) {
                    let sprintObject = sprint.toObject();
                    sprintObject.USList.sort((s1, s2) => {
                        return s1.priority - s2.priority;
                    });
                    resolve(sprintObject);
                } else {
                    projectService.getProjectByID(projectId)
                        .then((project) => {
                            let backlogObject = project.management.backlog.backlog.toObject();
                            backlogObject.USList.sort((s1, s2) => {
                                return s1.priority - s2.priority;
                            });
                            resolve(backlogObject);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
}

function deleteUS(projectId, sprintId, usId){
    return new Promise((resolve, reject) => {
        if(sprintId){
            getSprintByID(sprintId)
            .then((sprint) => {
                sprint.USList.pull({ _id: usId });
                sprint.save()
                    .then(() => resolve())
                    .catch((err) => reject(err));
            })
            .catch((err) => {
                reject(err);
            });
        }
        else{
            projectService.getProjectByID(projectId)
                .then((project) => {
                    let backlog = project.management.backlog.backlog;
                    backlog.USList.pull({ _id: usId });
                    project.save()
                        .then(() => resolve())
                        .catch((err) => reject(err));
                })
                .catch((err) => {
                    reject(err);
                });
        }
    });
}

function getUSById(sprintId, usId){
    return new Promise((resolve, reject) => {
        if(sprintId){
            getSprintByID(sprintId)
            .then((sprint) => {
                sprint.USList.findById(usId, (err, userStory) => {
                    if (err)
                        reject(err);
                    else
                        resolve(userStory);
                });
            });
        }
        else{
            UserStory.findById(usId, (err, userStory) => {
                if (err)
                    reject(err);
                else
                    resolve(userStory);
            });
        }
    });
}

function transferUS(projectId, firstSprintId, secondSprintId, usId){
    return new Promise((resolve, reject) => {
        projectService.getProjectByID(projectId)
            .then((project) => {
                if (!project)
                    reject();
                    
                getUSById(firstSprintId, usId)
                    .then((userStory) => {
                        if(!userStory)
                            reject();
                        if (secondSprintId) {
                            getSprintByID(secondSprintId)
                                .then((sprint) => {
                                    if (!sprint)
                                        reject();
                                    userStory.priority = sprint.USList.length;
                                    sprint.USList.push(userStory);
                                })
                                .catch((err) => {
                                    reject(err);
                                });
                        } else {
                            // Backlog section add
                            let backlog = project.management.backlog.backlog;
                            userStory.priority = backlog.USList.length;
                            backlog.USList.push(userStory);
                        }
                        project.save()
                            .then(() => resolve())
                            .catch((err) => reject(err));
                    })
                    .catch((err) => {
                        reject(err);
                    });
            })
            .catch((err) => {
                reject(err);
            });
    });
}

function updatePriority(usList, sprintId) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < usList.lenght; i++) {
            getUSById(sprintId, usList[i])
                .then((userStory) => {
                    userStory.priority = i+1;
                    userStory.save()
                        .then(() => resolve())
                        .catch((err) => reject(err));
                })
                .catch((err) => {
                    reject(err);
                });
        }
    });
}

function getSprintByID(projectId, sprintId) {
    return new Promise((resolve, reject) => {
        projectService.getProjectByID(projectId)
            .then((project) => {
                resolve(project.management
                    .backlog.sprints.id(sprintId));
            })
            .catch((err) => {
                reject(err);
            });
    });
}

module.exports = { addUS, getAllUS, deleteUS, getUSById, transferUS, updatePriority };
