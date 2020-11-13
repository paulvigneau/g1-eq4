const express = require('express');
const router = express.Router({ mergeParams: true });
const backlogService = require('../services/backlog.js');
const sprintService = require('../services/sprint.js');
const userStoryService = require('../services/user-story.js');
const projectService = require('../services/project');

router.get('/', function (req, res) {
    backlogService.getAllSprints(req.params.id)
        .then((backlog) => {
            res.render('backlog', {
                backlog: backlog,
                projectId: req.params.id
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

router.get('/new-sprint', function(req, res){
    projectService.getProjectByID(req.params.id)
        .then(() => {
            res.render('new-sprint', {
                projectId: req.params.id
            });
        })
        .catch(() => {
            res.redirect('/404');
        }
    );
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
    projectService.getProjectByID(req.params.id)
        .then(() => {
            res.render('new-user-story', {
                projectId: req.params.id
            });
        })
        .catch(() => {
                res.redirect('/404');
            }
        );
});

module.exports = router;
