// Sergio de Prado 13.02.2017
// Autofollower

var cron = require('node-cron');
var TwitterPackage = require('twitter');
var secret = require("./secret");
var fs = require('fs');

// This is going to tweet every four hours
cron.schedule('*/3 * * * *', function() {
	
	// Authorizing (secret.json is where all the authorizing data is)
	var Twitter = new TwitterPackage(secret);

	Twitter.get('followers/ids', function(err, reply){
		if(err) { return console.log(err);}
		
		var followers = reply.ids;
		var randFollower = randIndex(followers);
		
		Twitter.get('friends/ids', { user_id: randFollower }, function(err, reply){
			if(err) {return console.log(err);}
			
			var friends = reply.ids;
			var target = randIndex(friends);
			console.log(target);
			
			Twitter.post('friendships/create', {id: target}, function(err, reply){
				if(err) { return console.log(err);}	
			});
		});
	});
	
	function randIndex(arr){
		var index = Math.floor(arr.length*Math.random());
		return arr[index];
	}
});