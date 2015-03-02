"use strict";

var Promise = require("bluebird");
var logger = require('src/utils').logger(module);
var Twit = require('twit');

var twitterFeed = function feed(req, config) {

	var promiseCallback = function(resolve, reject) {
		

		var T = new Twit({
			consumer_key:			'cghIPQ5xAS8H3WlDkyiURw',
			consumer_secret:		'KbVoamKQidrhk5tdo6HNHx8iKm8kANhkNMSOWr6EidQ',
			access_token:			'16912759-3Ma5nGV1U3WD2zoN7c4Alj0jCgsDsMssaN3yXFBWT',
			access_token_secret:	'P22wjAeEnLXRAxVKbG4JzCjuAka0PMU3ldO87yrmZOlv3'
		});
			
		var data = {
			count: config && config.count || 10
		};
		
		if(config && config.max_id){
			data.max_id = config.max_id;
		}

		T.get('statuses/home_timeline', data, function(err, result) {
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

module.exports = function(req, config) {
	return twitterFeed(req);
};