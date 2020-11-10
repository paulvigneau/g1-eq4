const express = require('express');
let router = express.Router();
const projectModel = require('../models/project.js');

router.get('/', function (req, res) {
    projectModel.getAllProjects()
        .then(projects => {
            res.render('projects', {
                projects: projects
            });
        });
});

router.get('/new-project', function (req, res) {
    res.render('new-project');
});

router.post('/project', function (req, res) {
    const name = req.body.name;
    const description = req.body.description;
    const start = req.body.startDate;
    const end = req.body.endDate;
    projectModel.addProject(name, description, start, end);
    res.redirect('/');
});

const backlog = require('./backlog-routes');
router.use('/projects/:id', backlog);

module.exports = router;
