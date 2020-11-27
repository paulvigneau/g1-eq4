const projectService = require('./project');
const Sprint = require('../model/sprint');
const userStoryService = require('./user-story');
const { BadRequestError, NotFoundError } = require('../errors/Error');

function checkDatePeriod(start, end, date){
    return date >= start && date <= end;
}

function addSprint(projectId, start, end) {
    return new Promise((resolve, reject) => {
        projectService.getProjectByID(projectId)
            .then((project) => {
                if (!project)
                    return reject(new NotFoundError(`No project ${projectId} found.`));

                if(new Date(start) > new Date(end)){
                    return reject(new BadRequestError('Les dates doivent être dans le bon ordre.'));
                }

                if(!checkDatePeriod(new Date(project.start), new Date(project.end), new Date(start))){
                    return reject(new BadRequestError('La date de début doit se trouver dans l\'intervalle du projet.'));
                }

                if(!checkDatePeriod(new Date(project.start), new Date(project.end), new Date(end))){
                    return reject(new BadRequestError('La date de fin doit se trouver dans l\'intervalle du projet.'));
                }

                for(let i = 0; i < project.management.backlog.sprints.length; i++){
                    let curSprint = project.management.backlog.sprints[i];
                    if(checkDatePeriod(new Date(start), new Date(end), new Date(curSprint.start)) ||
                        checkDatePeriod(new Date(start), new Date(end), new Date(curSprint.end))){
                        return reject(new BadRequestError('Le nouveau sprint ne doit pas chevaucher un sprint existant.'));
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
                if (!project)
                    return reject(new NotFoundError(`No project ${projectId} found.`));

                resolve(project.management.backlog.sprints.id(sprintId));
            })
            .catch((err) => {
                reject(err);
            });
    });
}

function canDeleteSprint(projectId, sprintId) {
    return new Promise((resolve, reject) => {
        projectService.getProjectByID(projectId)
            .then(async (project) => {
                if (!project)
                    return reject(new NotFoundError(`No project ${projectId} found.`));

                await getSprintByID(projectId, sprintId)
                    .then(async (sprint) => {
                        if (!sprint)
                            return reject(new NotFoundError(`No sprint ${sprintId} found.`));

                        resolve(new Date(sprint.end) >= new Date());
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

function deleteSprint(projectId, sprintId){
    return new Promise((resolve, reject) => {
        projectService.getProjectByID(projectId)
            .then(async (project) => {
                if (!project)
                    return reject(new NotFoundError(`No project ${projectId} found.`));

                await getSprintByID(projectId, sprintId)
                    .then(async (sprint) => {
                        if(!sprint)
                            return reject(new NotFoundError(`No sprint ${sprintId} found.`));

                        if (new Date(sprint.end) < new Date()) {
                            return reject(new BadRequestError('La date de fin du sprint ne doit pas être déjà passée.'));
                        }

                        const listLength = sprint.USList.length;
                        let backlog = project.management.backlog.backlog;
                        for(let i = 0; i < listLength; i++){
                            let backlogLength = backlog.USList.length;
                            await userStoryService.transferUS(projectId, sprintId, null, sprint.USList[i]._id, backlogLength);
                            await userStoryService.addLabelToUS(projectId, sprint.USList[i]._id, 'Sprint supprimé');
                        }
                     })
                    .then(async () => {
                        // Get the project variable again after updating it in database
                        const project = await projectService.getProjectByID(projectId);
                        if (!project)
                            return reject(new NotFoundError(`No project ${projectId} found.`));

                        project.management.backlog.sprints.id(sprintId).remove();
                        project.save()
                            .then(() => resolve())
                            .catch((err) => reject(err));
                    })
                     .catch((err) => {
                        return reject(err);
                    });
            })
            .catch((err) => {
                return reject(err);
            });
    });
}

module.exports = { addSprint, getSprintByID, canDeleteSprint, deleteSprint };
