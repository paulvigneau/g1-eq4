let dbUtils = require('../dbUtils');
let objectId = dbUtils.getObjectId();

function addProject(name, description, start, end) {
    let dbo = dbUtils.getDb();

    let projects = dbo.collection('projects');
    let projectToAdd = {
        name: name,
        description: description,
        start: start,
        end: end,
        members: [],
        management: {
            backlog: {
                name: 'backlog',
                USList: []
            },
            sprints: [


            ]
        }
    };

    projects.insertOne(projectToAdd, function (err, result) {
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

function getProjectByID(id){
    return new Promise((resolve, reject) => {
        let dbo = dbUtils.getDb();
        dbo.collection('projects').findOne({ '_id': new objectId(id) }, function (err, result) {
            if (err){
                reject(err);
            }else {
                resolve(result);
            }
        });
    });
}

module.exports = { addProject, getAllProjects, getProjectByID };
