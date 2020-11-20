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
                    reject();

                let newIncr = project.incrUS+1;
                project.incrUS = newIncr;

                if (isNew)
                    userStory.id = newIncr;

                console.log(userStory);

                if (sprintId) {
                    getSprintByID(projectId, sprintId)
                        .then((sprint) => {
                            if (!sprint)
                                reject();

                            console.log('before', sprint.USList);

                            const newPriority = (priority > -1) ? Math.min(priority, sprint.USList.length) : 0;
                            sprint.USList = updatePriority(sprint.USList, newPriority);
                            userStory.priority = newPriority;
                            sprint.USList.push(userStory);

                            console.log('after', sprint.USList);

                            project.save() // Problem here
                                .then(() => resolve())
                                .catch((err) => reject(err));
                        })
                        .catch((err) => {
                            reject(err);
                        });
                }
                else {
                    // Backlog section add
                    let backlog = project.management.backlog.backlog;

                    console.log('before', backlog.USList);

                    const newPriority = (priority > -1) ? Math.min(priority, backlog.USList.length) : 0;
                    backlog.USList = updatePriority(backlog.USList, newPriority);
                    userStory.priority = newPriority;
                    backlog.USList.push(userStory);

                    console.log('after', backlog.USList);

                    project.save()
                        .then(() => resolve())
                        .catch((err) => reject(err));
                }

                console.log('project', project);


            })
            .catch((err) => {
                reject(err);
            });
    });
}

function getAllUS(projectId, sprintId) {
    return new Promise((resolve, reject) => {
        if (sprintId) {
            getSprintByID(projectId, sprintId)
                .then((sprint) => {
                    if (!sprint)
                        reject();

                    resolve(sprint.USList);
                })
                .catch((err) => {
                    reject(err);
                });
        }
        else {
            projectService.getProjectByID(projectId)
                .then((project) => {
                    if (!project)
                        reject();

                    resolve(project.management.backlog.backlog.USList);
                })
                .catch((err) => {
                    reject(err);
                });
        }
    });
}

function deleteUS(projectId, sprintId, usId){
    return new Promise((resolve, reject) => {
        if (sprintId) {
            getSprintByID(projectId, sprintId)
                .then((sprint) => {
                    if (!sprint)
                        reject();

                    sprint.USList.id(usId).remove();
                    sprint.save()
                        .then(() => resolve())
                        .catch((err) => reject(err));
                })
                .catch((err) => {
                    reject(err);
                });
        } else {
            projectService.getProjectByID(projectId)
                .then((project) => {
                    let backlog = project.management.backlog.backlog;
                    backlog.USList.id(usId).remove();
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

function getUSById(projectId, sprintId, usId) {
    return new Promise((resolve, reject) => {
        if (sprintId) {
            getSprintByID(projectId, sprintId)
                .then((sprint) => {
                    if (!sprint)
                        reject();

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
                        reject();

                    resolve(project.management.backlog.backlog.USList.id(usId));
                })
                .catch((err) => {
                    reject(err);
                });
        }
    });
}

function transferUS(projectId, firstSprintId, secondSprintId, usId, newPosition) {

    // Get us
    // Delete from first sprint
    // Add in second sprint with good priority

    return new Promise(async (resolve, reject) => {

        let userStory = await getUSById(projectId, firstSprintId, usId);
        console.log('get 1');
        if (!userStory)
            reject();

        console.log('get 2');
        await deleteUS(projectId, firstSprintId, userStory._id);
        console.log('deleted');
        await addExistingUS(projectId, secondSprintId, userStory, newPosition)
            .then(() => resolve)
            .catch((err) => reject(err));

        // getUSById(projectId, firstSprintId, usId)
        //     .then((userStory) => {
        //         if (!userStory)
        //             reject();
        //
        //         deleteUS(projectId, firstSprintId, userStory._id)
        //             .then(() => {
        //                 addExistingUS(projectId, secondSprintId, userStory, newPosition)
        //                     .then(() => resolve)
        //                     .catch((err) => reject(err));
        //             })
        //             .catch((err) => {
        //                 reject(err);
        //             });
        //     })
        //     .catch((err) => {
        //         reject(err);
        //     });
    });
}

function updatePriority(usList, newPriority) {
    for (let us of usList)
        if (us.priority >= newPriority)
            us.priority++;

    return usList;
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
