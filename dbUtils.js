const MongoClient = require( 'mongodb' ).MongoClient;
const url = "mongodb://localhost:27017";
const dbName = 'scrumProject';
let _db;

module.exports = {
    connectToServer: function( callback ) {
        MongoClient.connect( url,  { useNewUrlParser: true }, function( err, client ) {
            console.log('Connected successfully to server');
            _db = client.db(dbName);

            //Create collection projects
            _db.createCollection('projects', function (err, res) {
                if (err){
                    console.log('Collection projects already exist!');
                }else{
                    console.log('Collection projects created!');
                }
            });

            client.close();
            return callback(null, _db);
        } );
    },

    getDb: function() {
        return _db;
    },

    getDbName: function() {
        return dbName;
    },

    getURL: function(){
        return url;
    }
};