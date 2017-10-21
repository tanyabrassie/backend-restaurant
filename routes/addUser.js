var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

router.post('/addUser', function(req, res, next) {

	var postData = { 
		userPassword: req.body.userPassword,
		userName: req.body.userName
	};

	var url = 'mongodb://localhost:27017/restaurantUsers';

	// Use connect method to connect to the server
	MongoClient.connect(url, function(err, db) {
	   assert.equal(null, err);
	   console.log("Connected successfully to server");

        var collection = db.collection('users');
        collection.find({userName: postData.userName}).toArray(function(err, docs) {
	  	
            if (!docs.length == 0) {
    	  		console.log("This username has been taken");
    	  	} else {
    	  	    var insertDocuments = function(db, callback) {
                    // Insert some documents
                    collection.insert({userPassword: postData.userPassword, userName: postData.userName}, function(err, result) {
                        console.log("Inserted a user into the collection");
                        callback(result);
                    });
                }

                insertDocuments(db, function(result) {
                    console.log(result);
                    db.close();
                }); 
            }
        });
	});
});

router.get('/createAccount', function(req, res, next) {

	res.render('createAccount', { title: 'Create Account' });
});


module.exports = router;