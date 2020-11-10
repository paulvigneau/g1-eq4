const MongoClient = require( 'mongodb' ).MongoClient;
const url = 'mongodb://mongo:27017';
const dbName = 'scrumProject';
let _db;

function connectToServer(callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        if (err)
            throw err;

        console.log('Connected successfully to server');
        _db = client.db(dbName);

        // Create collection projects
        _db.createCollection('projects', function (err, res) {
            if (err) {
                console.log('Collection projects already exist!');
            } else {
                console.log('Collection projects created!');
            }
        });

        client.close();
        return callback(null, _db);
    });
}

function getDb() {
    return _db;
}

function getDbName() {
    return dbName;
}

function getURL(){
    return url;
}

module.exports = { connectToServer, getDb, getDbName, getURL };
