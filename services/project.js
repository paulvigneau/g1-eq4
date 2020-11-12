const Project = require('../model/project');
const Backlog = require('../model/backlog');

function addProject(p) {
    return new Promise((resolve, reject) => {
        const project = new Project(p);

        project.save((err, project) => {
            if (err)
                reject(err);
            else
                resolve(project);
        });
    });
}

function getAllProjects() {
    return new Promise((resolve, reject) => {
        Project.find({}).exec((err, projects) => {
            if (err)
                reject(err);
            else
                resolve(projects);
        });
    });
}

function getProjectByID(id) {
    return new Promise((resolve, reject) => {
        Project.findById(id, (err, project) => {
            if (err)
                reject(err);
            else
                resolve(project);
        });
    });
}

module.exports = { addProject, getAllProjects, getProjectByID };
