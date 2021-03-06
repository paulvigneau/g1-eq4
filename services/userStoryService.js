const projectService = require('./projectService');
const UserStory = require('../model/userStoryModel');
const { BadRequestError, NotFoundError } = require('../errors/Error');

function addUS(projectId, sprintId, description, difficulty, priority = -1) {
    const userStory = new UserStory({
        id: 0,
        description: description,
        difficulty: difficulty,
        priority: 0
    });

    return addExistingUS(projectId, sprintId, userStory, priority, true);
}

function addExistingUS(projectId, sprintId, userStory, priority, isNew = false) {
    return new Promise((resolve, reject) => {
        projectService.getProjectByID(projectId)
            .then((project) => {
                if (!project)
                    return reject(new NotFoundError(`No project ${projectId} found.`));

                if (isNew) {
                    let newIncr = project.incrUS + 1;
                    project.incrUS = newIncr;
                    userStory.id = newIncr;
                }

                let USList;
                if (sprintId) {
                    userStory.label = null;
                    USList = project.management.backlog.sprints.id(sprintId) ?
                        project.management.backlog.sprints.id(sprintId).USList :
                        null;
                }else {
                    USList = project.management.backlog.backlog.USList;
                }

                if (!USList)
                    return reject(new NotFoundError(`No sprint ${sprintId} found.`));

                const newPriority = (priority > -1) ? Math.min(priority, USList.length) : 0;
                USList = shiftUSPriorityToAdd(USList, newPriority);
                userStory.priority = newPriority;
                USList.push(userStory);

                project.save()
                    .then(() => resolve(userStory))
                    .catch((err) => reject(err));

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
                if (!project)
                    return reject(new NotFoundError(`No project ${projectId} found.`));

                if (sprintId) {
                    const sprint = project.management.backlog.sprints.id(sprintId);
                    if (sprint)
                        resolve(sprint.USList);
                    else
                        return reject(new NotFoundError(`No sprint ${sprintId} found.`));
                }
                else
                    resolve(project.management.backlog.backlog.USList);

            })
            .catch((err) => {
                return reject(err);
            });
    });
}

function deleteUS(projectId, sprintId, usId) {
    return new Promise((resolve, reject) => {
        projectService.getProjectByID(projectId)
            .then((project) => {
                if (!project)
                    return reject(new NotFoundError(`No project ${projectId} found.`));

                let USList;
                if (sprintId) {
                    const sprint = project.management.backlog.sprints.id(sprintId);
                    if (sprint)
                        USList = sprint.USList;
                    else
                        return reject(new NotFoundError(`No sprint ${sprintId} found.`));
                }
                else {
                    USList = project.management.backlog.backlog.USList;
                }

                const us = USList.id(usId);
                const priority = us.priority;
                us.remove();
                USList = shiftUSPriorityAfterDelete(USList, priority);
                project.save()
                    .then(() => resolve())
                    .catch((err) => reject(err));

            })
            .catch((err) => {
                return reject(err);
            });
    });
}

function getUSById(projectId, sprintId, usId) {
    return new Promise((resolve, reject) => {
        if (sprintId) {
            getSprintByID(projectId, sprintId)
                .then((sprint) => {
                    if (!sprint)
                        return reject(new NotFoundError(`No sprint ${sprint} found.`));

                    resolve(sprint.USList.id(usId));
                })
                .catch((err) => {
                    reject(err);
                });
        }
        else {
            projectService.getProjectByID(projectId)
                .then((project) => {
                    if (!project)
                        return reject(new NotFoundError(`No project ${projectId} found.`));

                    resolve(project.management.backlog.backlog.USList.id(usId));
                })
                .catch((err) => {
                    reject(err);
                });
        }
    });
}

function addLabelToUS(projectId, usId, label) {
    return new Promise((resolve, reject) => {
        projectService.getProjectByID(projectId)
            .then((project) => {
                if(!project)
                    return reject(new NotFoundError(`No project ${projectId} found.`));

                    let userStory = project.management.backlog.backlog.USList.id(usId);

                    if(!userStory)
                        return reject(new NotFoundError(`No user story ${usId} found.`));

                    userStory.label = label;
                    project.save()
                        .then(() => resolve(userStory))
                        .catch((err) => reject(err));
                    })
            .catch((err) => {
                reject(err);
            });

    });
}

function transferUS(projectId, firstSprintId, secondSprintId, usId, newPosition) {
    return new Promise((resolve, reject) => {
        getUSById(projectId, firstSprintId, usId)
            .then((userStory) => {
                if (!userStory)
                    return reject(new NotFoundError(`No User Story ${usId} found.`));

                if(userStory.status === 'Closed')
                    return reject(new BadRequestError(`User Story ${usId} is Closed.`));

                deleteUS(projectId, firstSprintId, userStory._id)
                    .then(() => {
                        addExistingUS(projectId, secondSprintId, userStory, newPosition)
                            .then((userStory) => {
                                resolve(userStory);
                            })
                            .catch((err) => {
                                reject(err);
                            });
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

function shiftUSPriorityToAdd(usList, newPriority) {
    for (let us of usList)
        if (us.priority >= newPriority)
            us.priority++;

    return usList;
}

function shiftUSPriorityAfterDelete(usList, oldPriority) {
    for (let us of usList)
        if (us.priority > oldPriority)
            us.priority--;

    return usList;
}

function getSprintByID(projectId, sprintId) {
    return new Promise((resolve, reject) => {
        projectService.getProjectByID(projectId)
            .then((project) => {
                resolve(project.management.backlog.sprints.id(sprintId));
            })
            .catch((err) => {
                reject(err);
            });
    });
}

function closeUS(projectId, sprintId, usId){
    return new Promise((resolve, reject) => {
        projectService.getProjectByID(projectId)
            .then((project) => {
                if(!project)
                    return reject(new NotFoundError(`No project ${projectId} found.`));

                let sprint = project.management.backlog.sprints.id(sprintId);
                if (!sprint)
                    return reject(new NotFoundError(`No sprint ${sprintId} found.`));

                let userStory = sprint.USList.id(usId);
                if(!userStory)
                    return reject(new NotFoundError(`No user story ${usId} found.`));

                if(userStory.status === 'Closed')
                    return reject(new BadRequestError(`L'user story ${usId} est déjà fermée.`));

                const taskList = project.management.tasks;
                for(let i = 0; i < taskList.length; i++){
                    const task = taskList[i];
                    if((task.USList.indexOf(usId) !== -1) && (task.status !== 'DONE')){
                        return reject(new BadRequestError(`La tâche ${task._id} n'est pas finie, impossible de fermer cette user story.`));
                    }
                }

                userStory.status = 'Closed';
                project.save()
                    .then(() => resolve(userStory))
                    .catch((err) => reject(err));
            })
            .catch((err) => {
                reject(err);
            });
    });
}

function modifyUserStory(projectId, sprintId, usId, newDescription, newDifficulty){
    return new Promise((resolve, reject) => {
        projectService.getProjectByID(projectId)
            .then((project) => {
                if(!project)
                    return reject(new NotFoundError(`No project ${projectId} found.`));

                let sprint = project.management.backlog.sprints.id(sprintId);
                let userStory = null;
                if(!sprint){
                    let backlog = project.management.backlog.backlog;
                    userStory = backlog.USList.id(usId);
                }else {
                    userStory = sprint.USList.id(usId);
                }

                if(!userStory)
                    return reject(new NotFoundError(`No user story ${usId} found.`));

                if(userStory.status === 'Closed')
                    return reject(new BadRequestError(`L'user story ${usId} est déjà fermée.`));

                const taskList = project.management.tasks;
                for(let i = 0; i < taskList.length; i++){
                    const task = taskList[i];
                    if((task.USList.indexOf(usId) !== -1)){
                        return reject(new BadRequestError(`Au moins une tâche est liée à cette user story ${usId}. Modification impossible.`));
                    }
                }

                userStory.description = newDescription;
                userStory.difficulty = newDifficulty;

                project.save()
                    .then(() => resolve(userStory))
                    .catch((err) => reject(err));
            });
    });
}

function getAllUsInProject(projectId){
    return new Promise((resolve, reject) => {
        projectService.getProjectByID(projectId)
            .then((project) => {
                if (!project)
                    return reject(new NotFoundError(`No project ${projectId} found.`));

                let usList = [];

                for(const userStory of project.management.backlog.backlog.USList){
                    usList.push(userStory);
                }

                for(const sprint of project.management.backlog.sprints){
                    for(const userStory of sprint.USList){
                        usList.push(userStory);
                    }
                }

                // usList.sort((us1, us2) => us1.id - us2.id );

                return resolve(usList);

            })
            .catch((err) => {
                return reject(err);
            });
    });
}

module.exports = { addUS, getAllUS, deleteUS, getUSById, transferUS, addLabelToUS, closeUS, modifyUserStory, getAllUsInProject };
