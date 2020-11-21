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

router.post('/sprint', function (req, res) {
    sprintService.addSprint(req.params.id, req.body.start, req.body.end)
    .then(() => {
        res.redirect('/projects/' + req.params.id + '/backlog');
    })
    .catch(() => {
        res.redirect('/404');
    });
});

router.delete('/sprints/:sprintId', function (req, res) {
    sprintService.deleteSprint(req.params.id, req.params.sprintId)
        .then(() => {
            res.redirect('/projects/' + req.params.id + '/backlog');
        })
        .catch(() => {
            res.redirect('/404');
        });
});

router.get('/new-sprint', function(req, res){
    res.render('new-sprint', {
        projectId: req.params.id
    });
});

router.post('/new-user-story', function (req, res) {
    userStoryService.addUS(req.params.id, null, req.body.description, req.body.difficulty)
        .then(() => {
            res.redirect('/projects/' + req.params.id + '/backlog');
        })
        .catch(() => {
            res.redirect('/404');
        });
});

router.get('/new-user-story', function(req, res){
    res.render('new-user-story', {
        projectId: req.params.id
    });
});

router.put('/user-story', function(req, res){
    userStoryService.transferUS(req.params.id,
        req.body.from, req.body.to, req.body.usId, req.body.index)
        .then(() => {
            res.status(200).send();
        })
        .catch(() => {
            res.status(404).send();
        });
});

module.exports = router;
