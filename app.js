const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const dbUtils = require('./dbUtils');
let projectModel = require('./models/project.js');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public/stylesheets')));

dbUtils.connectToServer(function(err, client){
    if(err) console.log(err);
});

// test insert
projectModel.addProject('grrgrgrgrgrrgrrgrg', 'des', 'lala', 'lele');

let routes = require('./routes/projects-routes');

app.use('/', routes);

app.listen(3000, function () {
    console.log('Scrum app listening on port 3000!');
});
