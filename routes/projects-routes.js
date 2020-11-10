const express = require('express');
let router = express.Router();
let projectModel = require('../models/project.js');

router.get('/', function (req, res) {
    res.render('projects');
});

router.get('/new-project', function (req, res) {
    res.render('new-project');
});

router.post('/projects'), function (req, res) {
    const name = req.body.name;
    const description = req.body.description;
    const start = req.body.startDate;
    const end = req.body.endDate;
    projectModel.addProject(name, description, start, end)
    res.redirect('/projects');
}

module.exports = router;
