const express = require('express');
let router = express.Router({ mergeParams: true });
const projectModel = require('../models/project.js');

router.get('/', function (req, res) {
    projectModel.getProjectByID(req.params.id)
        .then(project => {
            console.log(project);
            res.render('project', {
                name: project.name,
                description: project.description,
                start: project.start,
                end: project.end,
                members: project.members,
                management: project.management
            });
        });
});

module.exports = router;