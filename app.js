const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const config = require('config');

mongoose.connect(config.DBHost);
let db = mongoose.connection;
db.once('open', () => {
    console.log('Connexion à la base OK');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public/stylesheets')));

const projectsRoutes = require('./routes/projects-routes');
app.use('/', projectsRoutes);

app.get('/404', (req, res) => {
    res.status(404);
    res.render('not-found');
});

app.listen(3000, function () {
    console.log('Scrum app listening on port 3000!');
});

module.exports = app;
