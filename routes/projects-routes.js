const express = require('express');
let router = express.Router();
const projectModel = require('../services/project.js');

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
    if (name && description && start && end) {
        projectModel.addProject(name, description, start, end);
        res.redirect('/');
    }
    else
        res.status(400).send();
});

const project = require('./project-routes');
router.use('/projects/:id', project);

module.exports = router;
