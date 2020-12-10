const express = require('express');
const moment = require('moment');
const router = express.Router({ mergeParams: true });
const projectService = require('../services/projectService');
const memberService = require('../services/memberService');
const { BadRequestError } = require('../errors/Error');

router.get('/', function (req, res, next) {
    if (req.params.id) {
        projectService.getProjectByID(req.params.id)
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
    }
    else {
        next(new BadRequestError('Un ou plusieurs champs sont manquants.'));
    }
});

router.post('/member', function (req, res, next) {
    if (req.params.id && req.body.name && req.body.email && req.body.role) {
        memberService.addMember(req.params.id, req.body.name, req.body.email, req.body.role)
            .then(() => {
                memberService.sendEmailToNewMember(req.params.id, req.body.name, req.body.email, req.body.role);
                res.status(200).send();
            })
            .catch((err) => {
                next(err);
            });
    }
    else {
        next(new BadRequestError('Un ou plusieurs champs sont manquants.'));
    }
});

router.delete('/members/:memberId', function(req, res, next){
    if (req.params.id && req.params.memberId) {
        memberService.deleteMember(req.params.id, req.params.memberId)
            .then(() =>
                res.status(200).send()
            ).catch((err) =>
            next(err)
        );
    }
    else {
        next(new BadRequestError('Un ou plusieurs champs sont manquants.'));
    }
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
