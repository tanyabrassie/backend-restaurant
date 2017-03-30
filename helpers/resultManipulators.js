
var resultManipulators = {

	formatResults: function(data) {

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


			var restaurantName; 

			
			if (violation.dba != undefined) {

				restaurantName = violation.dba.toLowerCase();

			}


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

		return this.dateSorter(sortedResults);
	},

	
	dateSorter: function(sortedResults) {

		sortedResults.forEach(function(restaurant){

			restaurant.violationList.sort(function(violationA, violationB) {

				return violationB.date - violationA.date;

			});

			restaurant.grade = restaurant.violationList[0].grade;
			restaurant.score = restaurant.violationList[0].score;
			restaurant.dateStamp = restaurant.violationList[0].date;

		});

		return sortedResults;
	}

};

module.exports = resultManipulators;


