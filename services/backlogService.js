const projectService = require('./projectService');

function getAllSprints(id) {
    return new Promise((resolve, reject) => {
        projectService.getProjectByID(id)
            .then((project) => {
                resolve(project.management.backlog);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

module.exports = { getAllSprints };
