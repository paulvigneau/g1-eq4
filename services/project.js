const Project = require('../model/project');
const { BadRequestError } = require('../errors/Error');

function addProject(p) {
    return new Promise((resolve, reject) => {
          if (new Date(p.end) < new Date(p.start))
              return reject(new BadRequestError('Les dates doivent être dans le bon ordre.'));
          if (new Date(p.start) < new Date())
              return reject(new BadRequestError('La date de début du projet ne doit pas être passée.'));

        const project = new Project(p);

        project.save()
            .then((project) => resolve(project))
            .catch((err) => reject(new Error(err)));
    });
}

function getAllProjects() {
    return new Promise((resolve, reject) => {
        Project.find({}).exec((err, projects) => {
            if (err)
                reject(new Error(err));
            else
                resolve(projects);
        });
    });
}

function getProjectByID(id) {
    return new Promise((resolve, reject) => {
        Project.findById(id, (err, project) => {
            if (err)
                reject(new Error(err));
            else
                resolve(project);
        });
    });
}

function getProjectByName(name){
    return new Promise((resolve, reject) => {
        Project.findOne({ 'name': name }, (err, project) => {
            if (err)
                reject(new Error(err));
            else
                resolve(project);
        });
    });
}

module.exports = { addProject, getAllProjects, getProjectByID, getProjectByName };
