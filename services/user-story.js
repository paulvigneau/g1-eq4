const projectService = require('./project');
const UserStory = require('../model/user-story');
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
        projectService.getProjectByID(projectId)
            .then((project) => {
                if(sprintId) {
                    sprintService.getSprintByID(sprintId)
                        .then((sprint) => {
                            let sprintObject = sprint.toObject();
                            sprintObject.USList.sort((s1, s2) => {
                                return s1.priority - s2.priority;
                            })
                        .catch((err) => {
                            reject(err);
                        });
                            resolve(sprintObject);
                    });
                }else{
                    let backlogObject = project.management.backlog.backlog.toObject();
                    backlogObject.USList.sort((s1, s2) => {
                        return s1.priority - s2.priority;
                    });
                    resolve(backlogObject);
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
}

module.exports = { addUS };
