const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'scrumProject';
let _db;
let connection;

function connectToServer(callback) {
    connection = MongoClient.connect(url, { useNewUrlParser: true });

    connection.then(function (client) {
        console.log('Connected successfully to server');
        _db = client.db(dbName);
    })
    .catch(function(err){
        throw err;
    });

    connection.then(function (client) {
        // Create collection projects
        client.db(dbName).createCollection('projects',
            function (err, res) {
                if (err) {
                    console.log('Collection projects already exist!');
                } else {
                    console.log('Collection projects created!');
                }
            });
    })
    .catch(function(err){
        throw err;
    });

}

function getConnection() {
    return connection
}

function getDb() {
    return _db;
}

function getDbName() {
    return dbName;
}

function getURL() {
    return url;
}

module.exports = { connectToServer, getDb, getDbName, getURL, getConnection };
