let dbUtils = require('../dbUtils');
const MongoClient = require('mongodb').MongoClient;
// TODO Remplacer la duplication de code mongoclient.connect par
// TODO Soit la DB si on arrive à la get sans undefined
// TODO Soit une méthode connect pour get la db

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
    let dbo = dbUtils.getDb();

    dbo.collection('projects').find({}).toArray(function(err, result) {
        if (err){
            throw err;
        }else {
            console.log(result);
            db.close();
            return result;
        }
    });
}

module.exports = { addProject, getAllProjects };
