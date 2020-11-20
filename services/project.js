const Project = require('../model/project');

function addProject(p) {
    return new Promise((resolve, reject) => {
         if((new Date(p.end) < new Date(p.start)) || (new Date(p.start) < new Date())){
             return reject();
         }

        const project = new Project(p);

        project.save()
            .then((project) => resolve(project))
            .catch((err) => reject(err));
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

function getProjectByName(name){
    return new Promise((resolve, reject) => {
        Project.findOne({ 'name': name }, (err, project) => {
            if (err)
                reject(err);
            else
                resolve(project);
        });
    });
}

module.exports = { addProject, getAllProjects, getProjectByID, getProjectByName };
