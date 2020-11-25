const express = require('express');
const router = express.Router({ mergeParams: true });
const backlogService = require('../services/backlog.js');
const sprintService = require('../services/sprint.js');
const userStoryService = require('../services/user-story.js');
const moment = require('moment');

router.get('/', function (req, res) {
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
});

router.post('/sprint', function (req, res, next) {
    sprintService.addSprint(req.params.id, req.body.start, req.body.end)
    .then(() =>
        res.status(200).send()
    )
    .catch((err) =>
        next(err)
    );
});

router.delete('/sprints/:sprintId', function (req, res, next) {
    sprintService.deleteSprint(req.params.id, req.params.sprintId)
        .then(() =>
            res.status(200).send()
        )
        .catch((err) =>
            next(err)
        );
});

router.get('/new-sprint', function(req, res){
    res.render('new-sprint', {
        projectId: req.params.id
    });
}); // TODO Update e2e tests and delete this route

router.post('/new-user-story', function (req, res, next) {
    userStoryService.addUS(req.params.id, null, req.body.description, req.body.difficulty)
        .then(() => {
            res.status(200).send();
        })
        .catch((err) =>
            next(err)
        );
});

router.get('/new-user-story', function(req, res){
    res.render('new-user-story', {
        projectId: req.params.id
    });
}); // TODO Update e2e tests and delete this route

router.put('/user-story', function(req, res, next){
    userStoryService.transferUS(req.params.id,
        req.body.from, req.body.to, req.body.usId, req.body.index)
        .then(() => {
            res.status(200).send();
        })
        .catch((err) =>
            next(err)
        );
});

router.put('/:sprintId/:usId/close', function(req, res, next) {
    userStoryService.closeUS(req.params.id, req.params.sprintId, req.params.usId)
        .then(() => {
            console.log('SprintID ' + req.params.sprintId);
            console.log('usID ' + req.params.usId);
            res.status(200).send();
        })
        .catch((err) =>
            next(err)
        );
});

module.exports = router;
