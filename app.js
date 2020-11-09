const express = require("express");
const app = express();
const ejs = require("ejs");
var bodyParser = require("body-parser");
const path = require("path");

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'scrumProject';
const collection = 'projects';
let db;

MongoClient.connect(url,{ useNewUrlParser: true },  (err, client) => {
    if (!err) {
        console.log("Connected successfully to server");
        db = client.db(dbName);
        client.close();
    }
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname , "public/stylesheets")));

var routes = require('./routes/projects-routes');

app.use("/",routes);

app.listen(3000, function () {
    console.log("Scrum app listening on port 3000!");
});
