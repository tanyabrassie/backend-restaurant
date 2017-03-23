var express = require('express');
var router = express.Router();
var request = require('request');



router.post('/search', function (req, res, next){

	var postData = {
		zipcode: req.body.zipCode
	};

	console.log(postData.zipcode);

	// request('https://data.cityofnewyork.us/resource/9w7m-hzhe.json?zipcode=' + postData.zipcode , function (error, response, body) {
	request('https://data.cityofnewyork.us/resource/9w7m-hzhe.json?street=WILSON%20AVE', function (error, response, body) {
		
		var data = JSON.parse(body);
		console.log(data.length);
		res.send(data);

	});

});





module.exports = router;