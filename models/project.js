let dbUtils = require('../dbUtils');

function addProject(name, description, start, end) {
    let dbo = dbUtils.getDb();

    let projects = dbo.collection('projects');
    let projectToAdd = {
        name: name,
        description: description,
        start: start,
        end: end,
        members: [],

    };

    projects.insertOne(projectToAdd, function (err, res) {
        if (err) throw err;
    });
}

function getAllProjects(){
    return new Promise((resolve, reject) => {
        let dbo = dbUtils.getDb();
        dbo.collection('projects').find({}).toArray(function(err, result) {
            if (err){
                reject(err);
            }else {
                resolve(result);
            }
        });
    });
}

module.exports = { addProject, getAllProjects };
