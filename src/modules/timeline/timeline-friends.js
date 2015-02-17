"use strict";

var Promise = require("bluebird");
var graph = require('fbgraph');


var timeline = function timeline(req) {

  var promiseCallback = function(resolve, reject) {
    if (!req.userhelper.isAuthenticated()) {
      reject("User is not logged in");
    }
    var user = req.userhelper.getUser();
    var accessToken = user.fb_access_token;
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


    graph.setOptions(options)
		.get(user.fb_id + "/home", function(err, res) {
			resolve(res);
		});
  };

  return new Promise(promiseCallback);
};

module.exports = function(req) {
  return timeline(req);
};