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


		var capitalizedName = postData.restaurantName.toUpperCase().replace("'", "''");

		request("https://data.cityofnewyork.us/resource/9w7m-hzhe.json?$where=dba like'%25"+ capitalizedName + "%25' ", function (error, response, body){

			var data = JSON.parse(body);


			var sortedResults = [];


			data.forEach(function(violation) {

				var addedFlag = false;

				//making the date a real date
				var date = new Date(violation.inspection_date);

				//create the object for the violation data
				var violationObject = { date: date,
										description: violation.violation_description,
										code: violation.violation_code,
										score: violation.score,
										grade: violation.grade

										};

				var restaurantName = violation.dba.toLowerCase();
				var restaurantStreet = violation.street.toLowerCase();

				var restaurantObject = {
						id: violation.camis,
						name: restaurantName,
						address: violation.building + " " + restaurantStreet,
						violationList: []
					};


				//check to see if sorted results contains anything, if not populate a record						
				if (sortedResults.length == 0) {

					//create a restaurant object with an empty array for Violationlist
					
					//push the violation data object into the violation list
					restaurantObject.violationList.push(violationObject);

					//push the restaurant object into the sortedResults array
					sortedResults.push(restaurantObject);	

					addedFlag = true;	

				//if the sorted Results has a length then go through each 
				} 

				if (!addedFlag) {

					for (var i = 0; i < sortedResults.length; i++) {
						
						if (sortedResults[i].id == violation.camis) {

							sortedResults[i].violationList.push(violationObject);

							addedFlag = true;

							break;
						}
					}

				} 

				if (!addedFlag) {


					restaurantObject.violationList.push(violationObject);

					sortedResults.push(restaurantObject);


				}		

			});


			console.log(data.length);

			//ordering the results by date

			sortedResults.forEach(function(restaurant){

				restaurant.violationList.sort(function(violationA, violationB) {

					return violationB.date - violationA.date;

				});

				restaurant.grade = restaurant.violationList[0].grade;
				restaurant.score = restaurant.violationList[0].score;
				restaurant.dateStamp = restaurant.violationList[0].date;

			});









			res.render('results', {results: sortedResults});

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