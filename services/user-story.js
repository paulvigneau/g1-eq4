const projectService = require('./project');
const UserStory = require('../model/user-story');
const Backlog = require('../model/backlog');
const sprintService = require('./sprint');
const userStory = require('../model/user-story');

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
                    sprintService.getSprintByID(sprintId)
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
                project.save(resolve());
            })
            .catch((err) => {
                reject(err);
            });
    });
}

function getAllUS(projectId, sprintId) {
    return new Promise((resolve, reject) => {
        sprintService.getSprintByID(sprintId)
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
            sprintService.getSprintByID(sprintId)
            .then((sprint) => {
                sprint.USList.pull({ _id: usId });
                sprint.save(resolve());
            })
            .catch((err) => {
                reject(err);
            });
        }
        else{
            projectService.getProjectByID(projectId)
                .then((project) => {
                    console.log("step 1");
                    let backlog = project.management.backlog.backlog;
                    console.log("step 2");
                    backlog.USList.pull({ _id: usId });
                    console.log("step 3");
                    project.save(resolve());
                    console.log("step 4");
                })
                .catch((err) => {
                    console.log("error");
                    reject(err);
                });
        }
    });
}

function getUSById(sprintId, usId){
    return new Promise((resolve, reject) => {
        sprintService.getSprintByID(sprintId)
            .then((sprint) => {
                if(sprint){
                    sprint.USList.findById(usId, (err, userStory) => {
                        if (err)
                            reject(err);
                        else
                            resolve(userStory);
                    });
                }else{
                    Backlog.backlog.USList.findById(usId, (err, userStory) => {
                        if (err)
                            reject(err);
                        else
                            resolve(userStory);
                    });
                }
            });
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
                            sprintService.getSprintByID(secondSprintId)
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
                        project.save(resolve());
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

function updatePriotity(usList, sprintId) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < usList.lenght; i++) {
            getUSById(sprintId, usList[i])
                .then((userStory) => {
                    userStory.priority = i+1;
                    userStory.save(resolve);
                })
                .catch((err) => {
                    reject(err);
                });
        }
    });
}

module.exports = { addUS, getAllUS, deleteUS, getUSById, transferUS, updatePriotity };
