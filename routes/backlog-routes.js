const express = require('express');
const router = express.Router({ mergeParams: true });
const backlogService = require('../services/backlogService.js');
const sprintService = require('../services/sprintService.js');
const userStoryService = require('../services/userStoryService.js');
const moment = require('moment');
const { BadRequestError } = require('../errors/Error');

router.get('/', function (req, res, next) {
    if (req.params.id) {
        backlogService.getAllSprints(req.params.id)
            .then((backlog) => {
                res.render('backlog', {
                    backlog: backlog,
                    projectId: req.params.id,
                    moment: moment
                });
            })
            .catch(() => {
                res.redirect('/404');
            });
    }
    else {
        next(new BadRequestError('Un ou plusieurs champs sont manquants.'));
    }
});

router.post('/sprint', function (req, res, next) {
    if (req.params.id && req.body.start && req.body.end) {
        sprintService.addSprint(req.params.id, req.body.start, req.body.end)
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

router.delete('/sprints/:sprintId', function (req, res, next) {
    if (req.params.id && req.params.sprintId) {
        if (req.query.force === 'true') {
            sprintService.deleteSprint(req.params.id, req.params.sprintId)
                .then(() =>
                    res.status(200).send()
                )
                .catch((err) =>
                    next(err)
                );
        }
        else {
            sprintService.canDeleteSprint(req.params.id, req.params.sprintId)
                .then((possible) => {
                    if (possible)
                        res.status(401).send();
                    else
                        next(new BadRequestError('La date de fin du sprint ne doit pas être déjà passée.'));
                })
                .catch((err) =>
                    next(err)
                );
        }
    }
    else {
        next(new BadRequestError('Un ou plusieurs champs sont manquants.'));
    }
});

router.post('/user-story', function (req, res, next) {
    if (req.params.id && req.body.description && req.body.difficulty) {
        userStoryService.addUS(req.params.id, null, req.body.description, req.body.difficulty)
            .then(() => {
                res.status(200).send();
            })
            .catch((err) =>
                next(err)
            );
    }
    else {
        next(new BadRequestError('Un ou plusieurs champs sont manquants.'));
    }
});

router.put('/user-story', function(req, res, next) {
    if (req.params.id && req.body.usId && req.body.description && req.body.difficulty) {
        userStoryService.modifyUserStory(req.params.id, req.body.sprintId, req.body.usId, req.body.description, req.body.difficulty)
            .then(() => {
                res.status(200).send();
            })
            .catch((err) =>
                next(err)
            );
    }else{
        next(new BadRequestError('Un ou plusieurs champs sont manquants.'));
    }
});

router.put('/user-story/move', function(req, res, next){
    if (req.params.id && req.body.usId && req.body.index) {
        userStoryService.transferUS(req.params.id, req.body.from, req.body.to, req.body.usId, req.body.index)
            .then(() => {
                res.status(200).send();
            })
            .catch((err) =>
                next(err)
            );
    }
    else {
        next(new BadRequestError('Un ou plusieurs champs sont manquants.'));
    }
});

router.put('/:sprintId/:usId/close', function(req, res, next) {
    if (req.params.id && req.params.sprintId && req.params.usId) {
        userStoryService.closeUS(req.params.id, req.params.sprintId, req.params.usId)
            .then(() => {
                res.status(200).send();
            })
            .catch((err) =>
                next(err)
            );
    }
    else {
        next(new BadRequestError('Un ou plusieurs champs sont manquants.'));
    }
});

router.get('/user-stories/json', function (req, res, next) {
    userStoryService.getAllUsInProject(req.params.id)
        .then((usList) => {
            res.status(200).json({ usList: usList });
        })
        .catch((err) => {
            next(err);
        });
});

module.exports = router;
