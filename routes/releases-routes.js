const express = require('express');
const router = express.Router({ mergeParams: true });

router.get('/', function (req, res) {
    res.render('releases', {
        projectId: req.params.id
    });
});

module.exports = router;