const express = require('express');
const router = express.Router({ mergeParams: true });
const projetService = require('../services/project');
const memberService = require('../services/member');

router.get('/', function (req, res) {
    projetService.getProjectByID(req.params.id)
        .then((project) => {
            res.render('project', {
                project: project,
                projectId: req.params.id
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
});

router.post('/member', function (req, res) {
    memberService.addMember(req.params.id, req.body.name, req.body.email, req.body.role)
        .then(() => {
            res.redirect('/projects/' + req.params.id);
        });
});

router.post('/members/:memberId', function(req, res){
    memberService.deleteMember(req.params.id, req.params.memberId)
        .then(() => {
            res.redirect('/projects/' + req.params.id);
        });
});

const backlog = require('./backlog-routes');
router.use('/backlog', backlog);

module.exports = router;
