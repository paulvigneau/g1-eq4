const express = require('express');
let router = express.Router({ mergeParams: true });
const projectModel = require('../models/project.js');
const memberModel = require('../models/member');

router.get('/', function (req, res) {
    projectModel.getProjectByID(req.params.id)
        .then(project => {
            console.log(project);
            res.render('project', {
                project: project
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
    res.redirect('/');
});

module.exports = router;
