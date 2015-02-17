"use strict";

var Q = require('q');

var logger = require('src/utils').logger;


module.exports = function(req){


	var deferred = Q.defer();

	var response = {					
		isDev: process.env.NODE_ENV === "development",
		title: 'Timeline',
		data: {
			title: 'Your timeline',
			conf: require('src/config').login()
		},
		helpers:{},
		layout: 'main'
	};

	var timeline = require('src/modules/timeline/').friends(req);
	timeline.then(function(data){
		console.log("timeline", data);		
		response.data.timeline = data;	
		deferred.resolve(response);

	}).catch(TypeError, function(e) {
		logger.error(e.stack);
	}).catch(ReferenceError, function(e) {
		logger.error(e.stack);
	}).catch(function(e) {
		logger.error(e.stack);
		deferred.resolve(response);
	});


	return deferred.promise;
};