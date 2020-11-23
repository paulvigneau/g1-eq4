const express = require('express');
const moment = require('moment');
const router = express.Router({ mergeParams: true });
const projetService = require('../services/project');
const memberService = require('../services/member');

router.get('/', function (req, res) {
    projetService.getProjectByID(req.params.id)
        .then((project) => {
            res.render('project', {
                project: project,
                projectId: req.params.id,
                moment: moment
            });
        })
        .catch(() => {
            res.redirect('/404');
        }
    );
});

router.get('/new-member', function(req, res){
    projetService.getProjectByID(req.params.id)
        .then(() => {
            res.render('new-member', {
                projectId: req.params.id
            });
        })
        .catch(() => {
            res.redirect('/404');
        }
    );
}); // TODO Update e2e tests and delete this route

router.post('/member', function (req, res) {
    memberService.addMember(req.params.id, req.body.name, req.body.email, req.body.role)
        .then(() => {
            memberService.sendEmailToMember(req.params.id, req.body.name, req.body.email, req.body.role);
            res.status(200).send();
        })
        .catch((err) => {
            res.status(400).send(err);
        });
});

router.delete('/members/:memberId', function(req, res){
    memberService.deleteMember(req.params.id, req.params.memberId)
        .then(() =>
            res.status(200).send()
        ).catch((err) =>
            res.status(404).send(err)
    );
});

const backlog = require('./backlog-routes');
router.use('/backlog', backlog);

const tasks = require('./tasks-routes');
router.use('/tasks', tasks);

const tests = require('./tests-routes');
router.use('/tests', tests);

const documentations = require('./documentations-routes');
router.use('/documentations', documentations);

const releases = require('./releases-routes');
router.use('/releases', releases);

module.exports = router;
