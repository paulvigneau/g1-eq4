const express = require('express');
let router = express.Router({ mergeParams: true });
const projectModel = require('../models/project.js');

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

module.exports = router;
