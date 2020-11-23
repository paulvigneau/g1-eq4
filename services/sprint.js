const projectService = require('./project');
const Sprint = require('../model/sprint');
const userStoryService = require('./user-story');

function checkDatePeriod(start, end, date){
    return date >= start && date <= end;
}

function addSprint(projectId, start, end) {
    return new Promise((resolve, reject) => {
        projectService.getProjectByID(projectId)
            .then((project) => {
                if (!project) {
                    return reject(`No project ${projectId} found.`);
                }

                if(new Date(start) > new Date(end)){
                    return reject('Les dates doivent être dans le bon ordre.');
                }

                if(!checkDatePeriod(new Date(project.start), new Date(project.end), new Date(start))){
                    return reject('La date de début doit se trouver dans l\'intervalle du projet.');
                }

                if(!checkDatePeriod(new Date(project.start), new Date(project.end), new Date(end))){
                    return reject('La date de fin doit se trouver dans l\'intervalle du projet.');
                }

                for(let i = 0; i < project.management.backlog.sprints.length; i++){
                    let curSprint = project.management.backlog.sprints[i];
                    if(checkDatePeriod(new Date(start), new Date(end), new Date(curSprint.start)) ||
                        checkDatePeriod(new Date(start), new Date(end), new Date(curSprint.end))){
                        return reject('Le nouveau sprint ne doit pas chevaucher un sprint existant.');
                    }
                }

                const sprint = new Sprint({
                    start: start,
                    end: end,
                    USList: []
                });

                project.management.backlog.sprints.push(sprint);
                project.save()
                    .then(() => resolve(sprint))
                    .catch((err) => reject(err));
            })
            .catch((err) => {
                reject(err);
            });
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

function deleteSprint(projectId, sprintId){
    return new Promise((resolve, reject) => {
        projectService.getProjectByID(projectId)
            .then(async (project) => {
                if (!project)
                    return reject(`No project ${projectId} found.`);
                await getSprintByID(projectId, sprintId)
                    .then(async (sprint) => {
                        if(!sprint)
                            return reject();

                        if (new Date(sprint.end) < new Date()) {
                            return reject();
                        }

                        const listLength = sprint.USList.length;
                        let backlog = project.management.backlog.backlog;
                        for(let i = 0; i < listLength; i++){
                            let backlogLength = backlog.USList.length;
                            await userStoryService.transferUS(projectId, sprintId, null, sprint.USList[i]._id, backlogLength);
                            await userStoryService.addLabelToUS(projectId, sprint.USList[i]._id);
                        }

                     })
                     .catch((err) => {
                        return reject(err);
                    });
            })
            .then(async () => {
                // Get the project variable again after updating it in database
                const project = await projectService.getProjectByID(projectId);
                if (!project)
                    return reject(`No project ${projectId} found.`);

                project.management.backlog.sprints.id(sprintId).remove();
                project.save()
                    .then(() => resolve())
                    .catch((err) => reject(err));
            })
            .catch((err) => {
                return reject(err);
            });
    });
}

module.exports = { addSprint, getSprintByID, deleteSprint };
