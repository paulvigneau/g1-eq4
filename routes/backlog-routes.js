const express = require('express');
const router = express.Router({ mergeParams: true });
const backlogService = require('../services/backlog.js');
const sprintService = require('../services/sprint.js');
const userStoryService = require('../services/user-story.js');
const projectService = require('../services/project');
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

router.delete('/user-story', function(req, res){
    projectService.getProjectByID(req.params.id)
        .then((p) => {
            // console.log();
            console.log('in delete' +p.management.backlog.backlog.USList);
            // p.management.backlog.sprints.id(req.body.secondSprintId);


            // Project.findOne({ 'management.backlog.sprints._id' : req.body.secondSprintId })
            // .populate({path : 'name'})
            // .exec((err, doc) => {
            //     if (err) console.log('error is : '+err);
            //     console.log(doc);
            // });
        })
        .catch((err) => {
                console.log('errrrrror : '+ err);
            }
        );
    userStoryService.deleteUS(req.params.id,
        req.body.sprintId, req.body.usId)
        .then(() => {
            res.status(200).json({ status:'ok' });
        })
        .catch(() => {
            res.status(404).json({ status:'error', redirect:'/404' });
        });
});

router.post('/user-story', function(req, res){
    // console.log(req.params.id);
    // console.log(req.body.firstSprintId);
    // console.log(req.body.secondSprintId);
    // console.log(req.body.usId);
    // console.log(Sprint.id(req.body.secondSprintId));
    projectService.getProjectByID(req.params.id)
        .then((p) => {
            // console.log();
            console.log('in post' +p.management.backlog.backlog.USList);
            // p.management.backlog.sprints.id(req.body.secondSprintId);


            // Project.findOne({ 'management.backlog.sprints._id' : req.body.secondSprintId })
            // .populate({path : 'name'})
            // .exec((err, doc) => {
            //     if (err) console.log('error is : '+err);
            //     console.log(doc);
            // });
        })
        .catch((err) => {
                console.log('errrrrror : '+ err);
            }
        );
    // Sprint.findById(req.params.id, (err, doc) => {
    //     if (err) console.log('fucking err : '+err);
    //     console.log('sooo : '+doc);
    // });
    userStoryService.transferUS(req.params.id,
        req.body.firstSprintId, req.body.secondSprintId,
        req.body.usId)
        .then(() => {
            res.status(200).json({ status:'ok' });
        })
        .catch((err) => {
            console.log('Error : '+err);
            res.status(404).json({ status:'error', redirect:'/404' });
        });
});

module.exports = router;
