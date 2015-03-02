"use strict";

var Promise = require("bluebird");
var graph = require('fbgraph');

var logger = require('src/utils').logger();


var fbFeed = function feed(req) {

  var promiseCallback = function(resolve, reject) {

  	var user, 
  		accessToken,
  		facebookId;

    if (!req.userhelper.isAuthenticated()) {
       // temporary code for development
      //reject("User is not logged in");
      accessToken = "CAADuCyYQHbwBAMktuYTwsjtq3ZANe7iiokyq1yv19kFquDyZBN4lyuidmbX22KZAeTdCZBRq19CwAtf3JAdbdHkSHSqOpgLtkbadkxoPltgHqL1RiPHWW9FbbZBZBirkZA3aHa1RS5JPtBqf1ZA4iqjDYW3bYxDPtajOuneeD4LlCNdpPsf6k3TU4ZCVOlDxMNy9LwfY04FjodoDthZABGniJ9";
      facebookId = "569233875";
    }else{
    
    	user = req.userhelper.getUser();
    	accessToken = user.fb_access_token;
    	facebookId = user.fb_id;
    }
    graph.setAccessToken(accessToken);

    // only call this method if the threshhold is less than 
    /*
    graph.extendAccessToken({
    	"client_id":      '261731650641340', 
    	"client_secret":  'a5bde0c5259b063357b932cfd03b616c',
    	"access_token":    accessToken
    }, function (err, facebookRes) {
    	console.log(facebookRes, 'facebookRes');
    });
    */

    var options = {
      timeout: 3000,
      pool: {
        maxSockets: Infinity
      },
      headers: {
        connection: "keep-alive"
      }
    };

    var params = {
      fields: "comments.summary(1),likes.summary(1),id,name,picture,application,caption,created_time,description,from,is_hidden,link,message,message_tags,object_id,picture,place,privacy,properties,shares,source,status_type,story,story_tags,to,updated_time"
    };


	graph.setOptions(options).get(facebookId + "/home", params, function(err, res) {
		if(err){
			logger.error(err);
      reject(err);
      return;
		}
		resolve(res);
	});
  };

  return new Promise(promiseCallback);
};

module.exports = function(req) {
  return fbFeed(req);
};