var express = require('express');
var router = express.Router();
var request = require('request');
var restaurantCache = require('../helpers/restaurantCache');
var resultManipulators = require('../helpers/resultManipulators');

router.post('/search', function (req, res, next){
    
	var postData = {
		zipcode: req.body.zipCode,
		restaurantName: req.body.restaurantName,
		grade: req.body['grade[]']
	};
    
	//restaurant name only 
	if (postData.restaurantName) {

        console.log(postData.restaurantName);
		var capitalizedName = postData.restaurantName.toUpperCase().replace("'", "''");

		request("https://data.cityofnewyork.us/resource/9w7m-hzhe.json?$where=dba like'%25"+ capitalizedName + "%25' ", function (error, response, body){

			var data = JSON.parse(body);

			//run data through the format results function, giving to it the date sorter function as a callback. This returns the 
			//results reformatted violations sorted by most recent.
            var sortedResults = resultManipulators.formatResults(data);
            console.log(sortedResults);
            res.json(sortedResults);
		});

	//zipcode only 

	} else if (postData.zipcode && postData.grade == undefined) {

		request('https://data.cityofnewyork.us/resource/9w7m-hzhe.json?zipcode=' + postData.zipcode +'&&$limit=10000', function (error, response, body) {
			
			var data = JSON.parse(body);
			var sortedResults = resultManipulators.formatResults(data);

			res.render('results', {results: sortedResults});
			//res.send("HTTPARTY FUK YEH!");

		});

	} else if (postData.zipcode && postData.grade) {

		var gradeFormat = "(";

		if (typeof postData.grade == "string") {
			gradeFormat = "('"+postData.grade+"')";
		} else {

			postData.grade.forEach(function(grade, index) {

				if (index == postData.grade.length-1) {

					gradeFormat += " '" + grade + "')";
				
				} else {

					gradeFormat += " '" + grade + "',";
				}
			});
		}		

		request("https://data.cityofnewyork.us/resource/9w7m-hzhe.json?$where=grade in" + gradeFormat + " AND zipcode='" + postData.zipcode + "'", function (error, response, body){

			var data = JSON.parse(body);

			var sortedResults = resultManipulators.formatResults(data);
	
			res.render('results', {results: sortedResults});

		});
	}
});





module.exports = router;