let dbUtils = require('../dbUtils');
const MongoClient = require('mongodb').MongoClient;
//TODO je vais changer le mongoclient

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
    })
}

module.exports = {addProject};