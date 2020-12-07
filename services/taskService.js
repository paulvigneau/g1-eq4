const Task = require('../model/taskModel');
const projectService = require('./projectService');
const { NotFoundError, BadRequestError } = require('../errors/Error');

function getLengthDodByType(project, type){
    if (type === 'GEN') {
        return project.dod.gen.checklist.length;
    }
    if (type === 'DEV') {
        return project.dod.dev.checklist.length;
    }
    if (type === 'TEST') {
        return project.dod.test.checklist.length;
    }
}

function addTask(projectId, description, type, cost, memberId, USList, dependencies) {
    return new Promise((resolve, reject) => {
        projectService.getProjectByID(projectId)
            .then((project) => {
                if (!project)
                    return reject(new NotFoundError(`No project ${projectId} found.`));

                let checklistLength = getLengthDodByType(project, type);
                let checklist = new Array(checklistLength).fill(false);

                if(!USList)
                    USList = [];

                if(!dependencies)
                    dependencies = [];

                let status = 'TODO';
                if(project.members.id(memberId))
                    status = 'WIP';

                const task = new Task({
                    description: description,
                    type: type,
                    cost: cost,
                    status: status,
                    checklist: checklist,
                    member: memberId,
                    USList: USList,
                    dependencies: dependencies
                });

                project.management.tasks.push(task);

                project.save()
                    .then(() => resolve(task))
                    .catch((err) => reject(err));

            })
            .catch((err) => {
                return reject(err);
            });
    });
}

function getTaskById(projectId, taskId){
    return new Promise((resolve, reject) => {
        projectService.getProjectByID(projectId)
            .then((project) => {
                if(!project)
                    return reject(new NotFoundError(`No project ${projectId} found.`));

                const task = project.management.tasks.id(taskId);
                if(!task)
                    return reject(new NotFoundError(`No task ${taskId} found.`));

                resolve(task);
            })
            .catch((err) => {
                return reject(err);
            });
    });
}

function deleteTask(projectId, taskId) {
    return new Promise((resolve, reject) => {
        projectService.getProjectByID(projectId)
            .then((project) => {
                if (!project)
                    return reject(new NotFoundError(`No project ${projectId} found.`));

                const task = project.management.tasks.id(taskId);
                if(!task)
                    return reject(new NotFoundError(`No task ${taskId} found.`));

                if(task.status !== 'TODO')
                    return reject(new BadRequestError(`Status of ${taskId} is different from TODO.`));

                task.remove();

                project.save()
                    .then(() => resolve())
                    .catch((err) => reject(err));

            })
            .catch((err) => {
                return reject(err);
            });
    });
}

function updateTask(projectId, taskId, description, type, cost, memberId, USList, dependencies, dodValues) {
    return new Promise((resolve, reject) => {
        projectService.getProjectByID(projectId)
            .then((project) => {
                if (!project)
                    return reject(new NotFoundError(`No project ${projectId} found.`));

                const task = project.management.tasks.id(taskId);
                if (!task)
                    return reject(new NotFoundError(`No task ${taskId} found.`));

                if (task.status === 'TODO' || task.status === 'WIP') {
                    const member = project.members.id(memberId);
                    task.member = member ? member._id : null;

                    if (member && task.status === 'TODO')
                        task.status = 'WIP';
                }

                if (task.status === 'TODO') {
                    if (task.description !== description)
                        task.description = description;

                    if (task.cost !== cost)
                        task.cost = cost;

                    if (task.type !== type) {
                        let checklistLength = getLengthDodByType(project, type);
                        task.checklist = new Array(checklistLength).fill(false);
                        task.type = type;
                    }

                    task.USList = USList;
                    task.dependencies = dependencies;
                }
                else if (task.status === 'WIP') {
                    task.USList = task.USList ? task.USList : [];
                    task.dependencies = task.dependencies ? task.dependencies : [];

                    if (task.description !== description
                        || task.cost.toString() !== cost.toString()
                        || task.type !== type
                        || !(task.USList.length === USList.length
                            && task.USList.every((us1) =>
                                USList.find((us2) => us1.toString() === us2.toString())))
                        || !(task.dependencies.length === dependencies.length
                            && task.dependencies.every((d1) =>
                                dependencies.find((d2) => d1.toString() === d2.toString()))))

                        return reject(new BadRequestError('La tâche ne peut pas être modifiée car elle est en cours.'));

                    if (task.checklist.length !== dodValues.length)
                        return reject(new BadRequestError('Erreur durant la mise à jour de la DOD'));

                    task.checklist = dodValues;
                    if (task.checklist.every(c => c))
                        task.status = 'DONE';
                }
                else {
                    return reject(new BadRequestError('La tâche ne peut pas être modifiée car elle est terminée.'));
                }

                project.save()
                    .then(() => resolve(task))
                    .catch((err) => reject(err));

            })
            .catch((err) => {
                return reject(err);
            });
    });
}

function getAllTasks(projectId) {
    return new Promise((resolve, reject) => {
        projectService.getProjectByID(projectId)
            .then((project) => {
                if (!project)
                    return reject(new NotFoundError(`No project ${projectId} found.`));

                resolve(project.management.tasks);

            })
            .catch((err) => {
                return reject(err);
            });
    });
}

module.exports = { addTask, getTaskById, deleteTask, updateTask, getAllTasks };
