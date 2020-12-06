const express = require('express');
const router = express.Router({ mergeParams: true });
const taskService = require('../services/taskService');
const projectService = require('../services/projectService');
const { BadRequestError } = require('../errors/Error');

router.get('/', function (req, res) {
    projectService.getProjectByID(req.params.id)
        .then((project) => {
            res.render('tasks', {
                projectId: req.params.id,
                projectMembers: project.members,
                tasksList: project.management.tasks
            });
        })
        .catch(() => {
            res.redirect('/404');
        });
});

router.post('/', function (req, res, next) {
    if (req.params.id && req.body.description && req.body.type && req.body.cost) {
        taskService.addTask(req.params.id, req.body.description, req.body.type, req.body.cost,
            req.body.memberId, req.body.USList, req.body.dependencies)
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

router.put('/', function (req, res, next) {
    if (req.body.name && req.body.description && req.body.start && req.body.end) {
        taskService.updateTask(req.params.id, req.body.description, req.body.type, req.body.cost,
            req.body.memberId, req.body.USList, req.body.dependencies)
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

module.exports = router;
