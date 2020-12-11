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
                projectDod: project.dod,
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
        let usList = req.body.USList ? req.body.USList.split(',') : [];
        let dependencies = req.body.dependencies ? req.body.dependencies.split(',') : [];

        taskService.addTask(req.params.id, req.body.description, req.body.type, req.body.cost,
            req.body.member, usList, dependencies)
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
    if (req.params.id && req.body.taskId && req.body.description && req.body.type && req.body.cost) {
        let usList = req.body.USList ? req.body.USList.split(',') : [];
        let dependencies = req.body.dependencies ? req.body.dependencies.split(',') : [];
        let dodValues = req.body.dodValues ? req.body.dodValues.split(',') : [];

        taskService.updateTask(req.params.id, req.body.taskId, req.body.description, req.body.type, req.body.cost,
            req.body.member, usList, dependencies, dodValues)
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

router.get('/json', function (req, res, next) {
    taskService.getAllTasks(req.params.id)
        .then((tasks) => {
            res.status(200).json({ tasks: tasks });
        })
        .catch((err) => {
            next(err);
        });
});

module.exports = router;
