const projectService = require('./project');
const Sprint = require('../model/sprint');
const userStoryService = require('./user-story');
const Backlog = require('../model/backlog');

function checkDatePeriod(start, end, date){
    return date >= start && date <= end;
}

function addSprint(projectId, start, end) {
    return new Promise((resolve, reject) => {
        projectService.getProjectByID(projectId)
            .then((project) => {
                if (!project) {
                    return reject();
                }

                if(new Date(start) > new Date(end)){
                    return reject();
                }

                if(!checkDatePeriod(new Date(project.start), new Date(project.end), new Date(start))){
                    return reject();
                }

                if(!checkDatePeriod(new Date(project.start), new Date(project.end), new Date(end))){
                    return reject();
                }

                for(let i = 0; i < project.management.backlog.sprints.length; i++){
                    let curSprint = project.management.backlog.sprints[i];
                    if(checkDatePeriod(new Date(start), new Date(end), new Date(curSprint.start)) ||
                        checkDatePeriod(new Date(start), new Date(end), new Date(curSprint.end))){
                        return reject();
                    }
                }

                const sprint = new Sprint({
                    start: start,
                    end: end,
                    USList: []
                });

                project.management.backlog.sprints.push(sprint);
                project.save(resolve());
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
            .then((project) => {
                if (!project)
                    return reject();
                getSprintByID(projectId, sprintId)
                    .then((sprint) => {
                        if(!sprint)
                            return reject();
                        if(new Date(sprint.end) < new Date()){
                            return reject();
                        }

                        const listLength = sprint.USList.length;
                        let backlog = project.management.backlog.backlog;
                        for(let i = 0; i < listLength; i++){
                            //sprint.USList[i].label = 'test';
                            let backlogLength = backlog.USList.length;
                            userStoryService.transferUS(projectId, sprintId, null, sprint.USList[i]._id, backlogLength);
                            console.log(project.management.backlog.backlog.USList);
                        }

                     })
                     .catch((err) => {
                        reject(err);
                    });

                project.management.backlog.sprints.pull({ _id: sprintId });
                project.save(resolve());
            })
            .catch((err) => {
                reject(err);
            });
    });
}

module.exports = { addSprint, getSprintByID, deleteSprint };
