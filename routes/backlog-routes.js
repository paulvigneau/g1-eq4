const express = require('express');
let router = express.Router({ mergeParams: true });

router.get('/', function (req, res) {
    console.log(req.params);
    res.send('Backlog');
});

module.exports = router;
