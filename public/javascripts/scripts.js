//var button = document.getElementById('about-btn');

var button = $('#about-btn');
var modal = $('#about-text');
var modalButton = $('#modal-btn');
var form = $('#EmailForm');
var input = $('#EmailInput');

var showModal = false;

button.click(function(){
	if (!showModal) {
		modal.css('display', 'block');
		showModal = true;
	} else {
        modal.css('display', 'none');
        showModal = false;
    }
});


// modalButton.click(function(e){
// 	var emailData = input.val();


// 	modal.css('display', 'none');
// 	console.log(e);
// 	showModal = false;	
// });



form.submit(function(event){

	event.preventDefault();
	console.log("submitting");
    var responseMessage = $('#response');

	var emailAddress = input.val();

	var searchResult = emailAddress.search("@");

	if (searchResult === -1) {
		responseMessage.html("Your Email Address is InValid");
	} 

	else {
		//create a configuration object that will then be passed to ajax
		//this object needs a URL, a method type and data object
		var configuration = {
			url: form.attr("action"),
			type: form.attr("method"),
			data: {
				emailAddress: emailAddress
			},
			success: function(response) {
				if (response.error) {
					console.log("Shit, there's been an error");
				}
				console.log(response.congratsMessage);
				responseMessage.html(response.congratsMessage);
			},
			error: function () {
				// body...
			}
		};

		$.ajax(configuration);
	}
});









