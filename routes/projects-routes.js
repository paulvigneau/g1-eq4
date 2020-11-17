const express = require('express');
const moment = require('moment');
const router = express.Router();
const projectService = require('../services/project');

router.get('/', function (req, res) {
    projectService.getAllProjects()
        .then((projects) => {
            res.render('projects', {
                projects: projects,
                moment: moment
            });
        })
        .catch((err) => {
            res.status(404).send(err);
        }
    );
});

router.get('/new-project', function (req, res) {
    res.render('new-project');
});

router.post('/project', function (req, res) {
    projectService.addProject(req.body)
        .then(() =>
            res.redirect('/')
        )
        .catch((err) =>
            res.status(404).send(err)
        );
});

const project = require('./project-routes');
router.use('/projects/:id', project);

module.exports = router;
