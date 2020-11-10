let dbUtils = require('../dbUtils');
const MongoClient = require('mongodb').MongoClient;
// TODO Remplacer la duplication de code mongoclient.connect par
// TODO Soit la DB si on arrive à la get sans undefined
// TODO Soit une méthode connect pour get la db

function addProject(name, description, start, end) {
    MongoClient.connect(dbUtils.getURL(), function (err, db) {
        if (err) throw err;

        let dbo = db.db(dbUtils.getDbName());

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
            dbo.close;
        });
    });
}

function getAllProjects(){
    MongoClient.connect(dbUtils.getURL(), function (err, db) {
        if (err) throw err;

        let dbo = db.db(dbUtils.getDbName());

        dbo.collection('projects').find({}).toArray(function(err, result) {
            if (err){
                throw err;
            }else {
                console.log(result);
                db.close();
                return result;
            }
        });
    });
}

module.exports = { addProject, getAllProjects };
