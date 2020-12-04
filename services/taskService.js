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

function addTask(projectId, description, type, cost, memberId, USList, dependencies){
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

function updateTask(projectId, taskId, memberId, description, type, cost, USList, dependencies){
    return new Promise((resolve, reject) => {
        projectService.getProjectByID(projectId)
            .then((project) => {
                if (!project)
                    return reject(new NotFoundError(`No project ${projectId} found.`));

                const task = project.management.tasks.id(taskId);
                if(!task)
                    return reject(new NotFoundError(`No task ${taskId} found.`));

                if (status !== 'TODO')
                    return reject(new BadRequestError(`Status of ${taskId} is different from TODO.`));

                const member = project.members.id(memberId);
                if(!member)
                    return reject(new NotFoundError(`No member ${memberId} found.`));

                task.member = memberId;

                project.save()
                    .then(() => resolve(task))
                    .catch((err) => reject(err));

            })
            .catch((err) => {
                return reject(err);
            });
    });
}


