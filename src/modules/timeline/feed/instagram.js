"use strict";

var Promise = require("bluebird");
var graph = require('fbgraph');

var logger = require('src/utils').logger(module);


var igFeed = function feed(req) {

	var promiseCallback = function(resolve, reject) {
		
		var ig = require('instagram-node').instagram({});
		ig.use({ 
			access_token: '353722391.71c7cf4.b715204c2d004c84ae7330ad582abb1b' 
		});

		ig.user_self_feed(function(err, result, remaining, limit) {
			if(err){
				logger.error(err);
				reject(err);
				return;
			}
			resolve(result);
		});
	};
	
  return new Promise(promiseCallback);
};

module.exports = function(req) {
  return igFeed(req);
};