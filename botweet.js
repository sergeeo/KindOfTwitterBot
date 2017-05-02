// This version is going to be a bit more modular
// Sergio de Prado 13.02.2017
// A simple tweetbot, my first program in JS

var cron = require('node-cron');
var TwitterPackage = require('twitter');
var secret = require("./secret");
var fs = require('fs');

// This is going to tweet every four hours
cron.schedule('37 * * * *', function() {
	
	// Authorizing (secret.json is where all the authorizing data is)
	var Twitter = new TwitterPackage(secret);

	// we take the file and load it into an array
	var file = readFile();
	var tweets = file.split('\n');

	// we select a random tweet from the array
	var randomTweet = tweets[Math.floor(Math.random()*tweets.length)];

	// this removes the last random tweet from the file
	var index = tweets.indexOf(randomTweet);
	if (index > -1) {
		tweets.splice(index,1);
	}

	// this synchronous function loads a file
	function readFile(){
		return fs.readFileSync('tweets.txt', 'utf8');
	}

	// this function tweets our random tweet

	console.log('The random tweet is ' + randomTweet);
	Twitter.post('statuses/update', { status: randomTweet }, function (error, tweet, response) {
		if (error) {
			console.log(error);
		}
	});
	
	// this section removes the previous tweet from the array
	var counter = 0;
	var newFile = '';

	for(counter = 0 ; counter < tweets.length; counter++){
		if ((tweets[counter] != undefined)&&(tweets[counter] != '')) {
			newFile = newFile + tweets[counter] + '\n';
		}
	}

	// we save the modified array into the file
	fs.writeFile('tweets.txt', newFile, 'utf8', function (err){ 
		if(err) return console.log(err);
		});
		
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