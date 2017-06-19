var express = require('express');
var router = express.Router();

router.post('/emailSignUp', function(request, response){

	console.log(request);

	var emailAddress = request.body.emailAddress;

	if (emailAddress) {
		response.json({
			congratsMessage: "Thanks, your email address has been entered."
		});
	} else {
		response.json({
			error: 'something bad happened'
		});
	}
	
});

module.exports = router;