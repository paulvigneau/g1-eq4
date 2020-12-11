const express = require('express');
const moment = require('moment');
const router = express.Router();
const projectService = require('../services/projectService');
const { BadRequestError } = require('../errors/Error');

router.get('/', function (req, res, next) {
    projectService.getAllProjects()
        .then((projects) => {
            res.render('projects', {
                projects: projects,
                moment: moment
            });
        })
        .catch((err) => {
            next(err);
        }
    );
});

router.post('/project', function (req, res, next) {
    if (req.body.name && req.body.description && req.body.start && req.body.end) {
        projectService.addProject(req.body)
            .then(() =>
                res.status(200).send()
            )
            .catch((err) =>
                next(err)
            );
    }
    else {
        next(new BadRequestError('Un ou plusieurs champs sont manquants.'));
    }
});

const project = require('./project-routes');
router.use('/projects/:id', project);

module.exports = router;
