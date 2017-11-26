var express = require('express');
var router = express.Router();
var request = require('request');

router.post('/createAccount', function(req, res, next) {
    console.log(req);

});

module.exports = router;