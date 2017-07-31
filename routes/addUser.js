var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

router.post('/addUser', function(req, res, next) {

	var postData = { 
		userName: req.body.userName,
		userPassword: req.body.userPassword
	};

	var url = 'mongodb://localhost:27017/restaurantUsers';

	// Use connect method to connect to the server
	MongoClient.connect(url, function(err, db) {
	  assert.equal(null, err);
	  console.log("Connected successfully to server");

	  var insertDocuments = function(db, callback) {
	  // Get the documents collection
	  var collection = db.collection('users');
	  // Insert some documents
	  collection.insert({user: postData.userName, password: postData.userPassword}, function(err, result) {
	    // assert.equal(err, null);
	    // assert.equal(3, result.result.n);
	    // assert.equal(3, result.ops.length);
	    console.log("Inserted a user into the collection");
	    callback(result);
	  });
	}

	insertDocuments(db, function(result) {
		console.log(result);
	});	

	  db.close();
	});

});

router.get('/createAccount', function(req, res, next) {

	res.render('createAccount', { title: 'Create Account' });
});


module.exports = router;