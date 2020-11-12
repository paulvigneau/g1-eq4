const projectService = require('../services/project');

function getAllSprints(id) {
    return new Promise((resolve, reject) => {
        projectService.getProjectByID(id)
            .then((project) => {
                let sortedBacklog = project.management.backlog.toObject();
                sortedBacklog.sprints.sort((s1, s2) => { return new Date(s2.start) - new Date(s1.start); });
                resolve(sortedBacklog);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

module.exports = { getAllSprints };
