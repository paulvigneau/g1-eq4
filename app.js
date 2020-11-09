const express = require('express');
const ejs = require('ejs');
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'scrumProject';
const collection = 'projects';
let db;

const app = express();

MongoClient.connect(url,{ useNewUrlParser: true },  (err, client) => {
    if (!err) {
        console.log("Connected successfully to server");
        db = client.db(dbName);
        client.close();
    }
});

app.get('/', (req, res) => {
    res.send('Root');
});

app.listen(3000, () => {
    console.log('Listening on port 3000!');
})
