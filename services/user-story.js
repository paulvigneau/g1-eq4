const projectService = require('./project');
const UserStory = require('../model/user-story');

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
                    getSprintByID(projectId, sprintId)
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
        getSprintByID(projectId, sprintId)
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
            getSprintByID(projectId, sprintId)
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

function getUSById(projectId, sprintId, usId){
    console.log('in getUsById');
    return new Promise((resolve, reject) => {
        if(sprintId){
            console.log('in getUsById if');
            getSprintByID(projectId, sprintId)
                .then((sprint) => {
                    console.log(sprint.USList.id(usId));
                    resolve(sprint.USList.id(usId));
                })
                .catch((err) => {
                    reject(err);
                });
        }
        else{
            projectService.getProjectByID(projectId)
                .then((project) => {
                    console.log('in getUsById else');
                    console.log('us = '+usId);
                    console.log(project.management
                        .backlog.backlog.USList);
                    console.log(project.management
                        .backlog.backlog.USList.id(usId));
                    resolve(project.management
                        .backlog.backlog.USList.id(usId));
                })
                .catch((err) => {
                    reject(err);
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
                    console.log("here 1");
                getUSById(projectId, firstSprintId, usId)
                    .then((userStory) => {
                        if(!userStory)
                            reject();
                            console.log("here 2");
                        if (secondSprintId) {
                            getSprintByID(projectId, secondSprintId)
                                .then((sprint) => {
                                    if (!sprint)
                                        reject();
                                        console.log("here 3 : " + sprint);
                                    console.log(userStory);
                                    userStory.priority.set(sprint.USList.length);
                                    console.log('size : '+sprint.USList.length);
                                    sprint.USList.push(userStory);
                                    console.log("here 4");
                                })
                                .catch((err) => {
                                    console.log("here 5");
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

function updatePriority(projectId, usList, sprintId) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < usList.lenght; i++) {
            getUSById(projectId, sprintId, usList[i])
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
                console.log(sprintId);
                console.log(project.management
                    .backlog.sprints.id(sprintId));
                resolve(project.management
                    .backlog.sprints.id(sprintId));
            })
            .catch((err) => {
                reject(err);
            });
    });
}

module.exports = { addUS, getAllUS, deleteUS, getUSById, transferUS, updatePriority };
