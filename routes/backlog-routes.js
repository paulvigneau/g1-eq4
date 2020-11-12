const express = require('express');
const router = express.Router({ mergeParams: true });
const backlogService = require('../services/backlog.js');
const sprintService = require('../services/sprint.js');
const projetService = require('../services/project');

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
    console.log(req.params.id);
        res.redirect('/projects/' + req.params.id + '/backlog');
    })
    .catch(() => {
        res.redirect('/404');
    });
});

router.get('/new-sprint', function(req, res){
    projetService.getProjectByID(req.params.id)
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

module.exports = router;
