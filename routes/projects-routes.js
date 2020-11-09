const express = require('express');
let router = express.Router();
let projectModel = require('../models/project.js');

//projectModel.addProject('bergrsgrrg','des','lala','lele');

router.get('/', (req, res) => {
    res.render('projects');
});

module.exports = router;