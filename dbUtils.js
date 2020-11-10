const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'scrumProject';
let objectId = require('mongodb').ObjectID;
let _db;

function getDbName() {
    return dbName;
}

function getURL() {
    return url;
}

function getObjectId(){
    return objectId;
}

module.exports = { 
    connectToServer: function( callback ) {
        MongoClient.connect( url,  { useNewUrlParser: true }, function( err, client ) {
          _db  = client.db(dbName);
          return callback( err );
        } );
    }, 

    getDb: function() {
        return _db;
    },

    getDbName, 
    
    getURL,

    getObjectId
};
