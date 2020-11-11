const express = require('express');
let router = express.Router({ mergeParams: true });
const backlogModel = require('../services/backlog.js');

router.get('/', function (req, res) {
    backlogModel.getAllSprints(req.params.id)
        .then(backlog => {
            res.render('backlog', {
                backlog: backlog,
                projectId: req.params.id
            });
        })
        .catch(() => {
            res.redirect('/404');
    });
});

module.exports = router;
