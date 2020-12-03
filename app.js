const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dbConfig = require('./config/db');
const path = require('path');
const bodyParser = require('body-parser');
const { BadRequestError, NotFoundError } = require('./errors/Error');

dbConfig.connectToDB();

app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const projectsRoutes = require('./routes/projects-routes');
app.use('/', projectsRoutes);

app.get('/404', (req, res) => {
    res.status(404);
    res.render('not-found');
});

app.use((err, req, res, next) => {
    if (err instanceof NotFoundError)
        res.status(404).send({ message: err.message });
    else if (err instanceof BadRequestError)
        res.status(400).send({ message: err.message });
    else if (err instanceof mongoose.Error) {
        let message = '';
        for (let field in err.errors) {
            message += err.errors[field].message + '\n';
        }
        res.status(400).send({ message: message });
    }
    else
        res.status(500).send({ message: err.message });
});

app.listen(3000, function () {
    console.log('Scrum app listening on port 3000!');
});

module.exports = app;
