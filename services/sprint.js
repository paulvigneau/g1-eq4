const projectService = require('./project');
const Backlog = require('../model/backlog');
const Sprint = require('../model/sprint');

function checkDatePeriod(start, end, date){
    if(date >= start && date < end){
        return true;
    }else{
        return false;
    }
}

function addSprint(projectId, start, end) {
    return new Promise((resolve, reject) => {
        projectService.getProjectByID(projectId)
            .then((project) => {
                if (!project)
                    reject();

                for(let i = 0; i < project.management.backlog.sprints.length; i++){
                    let curSprint = project.management.backlog.sprints[i];
                    if(checkDatePeriod(new Date(start), new Date(end), new Date(curSprint.start)) ||
                        checkDatePeriod(new Date(start), new Date(end), new Date(curSprint.end))){
                        reject();
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

function getSprintByID(id) {
    return new Promise((resolve, reject) => {
        Backlog.sprints.findById(id, (err, project) => {
            if (err)
                reject(err);
            else
                resolve(project);
        });
    });
}

module.exports = { addSprint, getSprintByID };