
var restaurantData = [];
var timeSaved;


var restaurantCache = {

	save: function(data) {

		restaurantData = data;
		timeSaved = Date.now()/1000;

	},

	hasData: function() {

		var currentTime = Date.now()/1000;
		var secondsInDay = 86400;

		if (restaurantData.length == 0 || (currentTime - timeSaved) > secondsInDay) {

			return false; 
		
		} else {

			 return true;
		}
	},


	getData: function () {

		return restaurantData;
	}

};

module.exports = restaurantCache;