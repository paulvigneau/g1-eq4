const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const dbUtils = require('./dbUtils');
const bodyParser = require('body-parser');
// let projectModel = require('./models/project.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public/stylesheets')));

dbUtils.connectToServer(function(err, client){
    if(err) console.log(err);
});

const projectsRoutes = require('./routes/projects-routes');
app.use('/', projectsRoutes);
app.use('/project', projectsRoutes);


app.get('/404', (req, res) => {
    res.status(404);
    res.render('not-found');
});

app.listen(3000, function () {
    console.log('Scrum app listening on port 3000!');
});
