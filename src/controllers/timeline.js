"use strict";

var Q = require('q');

module.exports = function(req){
	
	var deferred = Q.defer();

	setTimeout(function(){

		deferred.resolve({
					
			isDev: process.env.NODE_ENV === "development",
			title: 'Timeline',
			data: {
				title: 'Your timeline',
				conf: require('src/config').login()
			},
			helpers:{},
			layout: 'main'
		});

	}, 10);

	return deferred.promise;
};