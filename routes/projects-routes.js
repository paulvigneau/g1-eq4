const express = require('express');
let router = express.Router();
let projectModel = require('../models/project.js');

router.get('/', (req, res) => {
    res.render('projects');
});

module.exports = router;