"use strict";

var Q = require('q');

var utils = require('src/utils');
var logger = utils.logger;

var timeline = require('src/modules/timeline/');

var Promise = require("bluebird");

var facebookHbs = utils.customHbs.facebook;

var timelineModule = function(req){

	var response = {
		isDev: process.env.NODE_ENV === "development",
		title: 'Timeline',
		data: {
			title: 'Your timeline',
			conf: require('src/config').login(),
			timeline: {
				feed:[]
			}
		},
		helpers: facebookHbs
	};
	var core = {
		resolve: null,
		reject: null,
		getFeed: function(){
			return new Promise(this.resolver.bind(this));
		},
		resolver: function(resolve, reject){

			this.resolve = resolve;
			this.reject = reject;

			//this.resolve(response);
			//return;
			var timelinePromise = timeline.feed(req);
			timelinePromise
				.then(this.success.bind(this))
				.catch(TypeError, this.error.bind(this))
				.catch(ReferenceError, this.error.bind(this))
				.catch(this.error.bind(this));

		},
		success: function(result){
			response.data.result = result;
			this.resolve(response);
			// Note: Temporary return;
			return;
			var record;
			if(result && result.data && result.data.length){
				result.data.forEach(function(post){
					record = {
						type: 'facebook'
					};
					record.posts = [
						post
					];
					response.data.timeline.feed.push(record);
				});
			}else{
				logger.error("facebook timeline results is empty or invalid", result);
			}
			this.resolve(response);
		},

		error: function(err){
			logger.error(err);
			this.reject(response);
		}
	};
	return core;
};

module.exports = function(req){

	return timelineModule(req).getFeed();
};