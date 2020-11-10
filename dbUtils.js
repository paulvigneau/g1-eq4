const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'scrumProject';
let _db;

function getDbName() {
    return dbName;
}

function getURL() {
    return url;
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
    
    getURL
};
