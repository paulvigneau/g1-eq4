const projectService = require('./project');
const UserStory = require('../model/user-story');

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
                    return reject();

                if (isNew) {
                    let newIncr = project.incrUS + 1;
                    project.incrUS = newIncr;
                    userStory.id = newIncr;
                }

                let USList;
                if (sprintId)
                    USList = project.management.backlog.sprints.id(sprintId) ?
                        project.management.backlog.sprints.id(sprintId).USList :
                        null;
                else
                    USList = project.management.backlog.backlog.USList;

                if (!USList)
                    return reject();

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
                    return reject();

                if (sprintId) {
                    const sprint = project.management.backlog.sprints.id(sprintId);
                    if (sprint)
                        resolve(sprint.USList);
                    else
                        return reject();
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
                    return reject();

                let USList;
                if (sprintId) {
                    const sprint = project.management.backlog.sprints.id(sprintId);
                    if (sprint)
                        USList = sprint.USList;
                    else
                        return reject();
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
                        return reject();

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
                        return reject();

                    resolve(project.management.backlog.backlog.USList.id(usId));
                })
                .catch((err) => {
                    reject(err);
                });
        }
    });
}

function transferUS(projectId, firstSprintId, secondSprintId, usId, newPosition) {
    return new Promise((resolve, reject) => {
        getUSById(projectId, firstSprintId, usId)
            .then((userStory) => {
                if (!userStory)
                    return reject();

                deleteUS(projectId, firstSprintId, userStory._id)
                    .then(() => {
                        addExistingUS(projectId, secondSprintId, userStory, newPosition)
                            .then(() => {
                                resolve();
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

module.exports = { addUS, getAllUS, deleteUS, getUSById, transferUS };
