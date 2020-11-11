const express = require('express');
let router = express.Router({ mergeParams: true });
const projectModel = require('../services/project.js');
const memberModel = require('../services/member');

router.get('/', function (req, res) {
    projectModel.getProjectByID(req.params.id)
        .then(project => {
            res.render('project', {
                project: project,
                projectId:req.params.id
            });
        })
        .catch(() => {
            res.redirect('/404');
    });
});

router.get('/new-member', function(req, res){
    projectModel.getProjectByID(req.params.id)
        .then(project => {
        res.render('new-member', {
            project: project
            });
        })
        .catch(() => {
            res.redirect('/404');
    });
});

router.post('/member', function (req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const role = req.body.role;
    memberModel.addMember(req.params.id, name, email, role);
    res.redirect('/projects/' + req.params.id);
});

router.post('/members/:memberId', function(req, res){
    memberModel.deleteMember(req.params.id, req.params.memberId);
    res.redirect('/projects/' + req.params.id);
});

const backlog = require('./backlog-routes');
router.use('/backlog', backlog);

module.exports = router;
