var express = require('express');
var router = express.Router();
var request = require('request');
var restaurantCache = require('../helpers/restaurantCache');



router.post('/search', function (req, res, next){

	var postData = {
		zipcode: req.body.zipCode,
		restaurantName: req.body.restaurantName,
		miles: req.body.miles,
		grade: req.body['grade[]']
	};

	console.log(postData.zipcode);


	if (postData.restaurantName) {

		//OLD CODE FOR CACHING IDEA.
		// if (restaurantCache.hasData() ) {

		// 	var data = restaurantCache.getData();
		
		// } else {

		// 	request('https://data.cityofnewyork.us/resource/9w7m-hzhe.json?$where=dba like '%25CARACAS%25'', function (error, response, body) {
			
		// 		var data = JSON.parse(body);

		// 		restaurantCache.save(data);

		// 		console.log(data.length);
		// 		res.send(data);

		// 	});

		// }

		var capitalizedName = postData.restaurantName.toUpperCase();

		request("https://data.cityofnewyork.us/resource/9w7m-hzhe.json?$where=dba like '%25"+ capitalizedName + "%25' ", function (error, response, body){

			var data = JSON.parse(body);
			console.log(data.length);
			res.send(data);

		});


	} else if (postData.zipcode && postData.miles == undefined && postData.grade ==undefined) {

		request('https://data.cityofnewyork.us/resource/9w7m-hzhe.json?$limit10000&&zipcode=' + postData.zipcode, function (error, response, body) {
		
			var data = JSON.parse(body);
			console.log(data.length);
			res.send(data);

		});

	} else if (postData.zipcode && postData.grade && postData.miles == "" ) {

		var gradeFormat = "(";

		postData.grade.forEach(function(grade, index) {

			if (postData.grade.length == 1) {

				gradeFormat = "('"+grade+"')";
			}

			else if (index == postData.grade.length-1) {

				gradeFormat += " '" + grade + "')";
			
			} else {

				gradeFormat += " '" + grade + "',";
			}

			

		});

		request("https://data.cityofnewyork.us/resource/9w7m-hzhe.json?$where=grade in('A', 'B') AND zipcode='" + postData.zipcode + "'", function (error, response, body){

			var data = JSON.parse(body);
			console.log(data.length);
			res.send(data);

		});
	}
});





module.exports = router;