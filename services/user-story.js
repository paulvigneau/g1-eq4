const projectService = require('./project');
const UserStory = require('../model/user-story');
const Backlog = require('../model/backlog');
const sprintService = require('./sprint');

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

function deleteUS(projectId, sprintId, USId){
    return new Promise((resolve, reject) => {
        sprintService.getSprintByID(sprintId)
            .then((sprint) => {
                if (sprint){
                    sprint.USList.pull({_id: USId});
                    sprint.save(resolve());
                }else{
                    projectService.getProjectByID(projectId)
                        .then((project) => {
                            let backlog = project.management.backlog.backlog;
                            backlog.USList.pull({_id: USId});
                            backlog.save(resolve());
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

function getUSById(sprintId, USId){
    return new Promise((resolve, reject) => {
        sprintService.getSprintByID(sprintId)
            .then((sprint) => {
                if(sprint){
                    sprint.USList.findById(USId, (err, userStory) => {
                        if (err)
                            reject(err);
                        else
                            resolve(userStory);
                    });
                }else{
                    Backlog.backlog.USList.findById(USId, (err, userStory) => {
                        if (err)
                            reject(err);
                        else
                            resolve(userStory);
                    });
                }
            });
    });
}

function transferUS(projectId, firstSprintId, secondSprintId, USId){
    return new Promise((resolve, reject) => {
        projectService.getProjectByID(projectId)
            .then((project) => {
                if (!project)
                    reject();

                getUSById(firstSprintId, USId)
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

module.exports = { addUS, getAllUS, deleteUS, getUSById, transferUS };
