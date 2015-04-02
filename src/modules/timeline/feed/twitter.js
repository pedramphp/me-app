"use strict";

var Promise = require("bluebird");
var logger = require('src/utils').logger(module);
var Twit = require('twit');
var MAX_COUNT = 200;

var TwitterCacheModelHelper = require('src/model-helpers').TwitterCacheModelHelper;

var twitterCacheModelHelper = new TwitterCacheModelHelper();


var twitterFeed = function(req, config) {

	var core = {
		resolve: null,
		reject: null,
		getFeed: function() {
			return new Promise(this.resolver.bind(this));
		},

		resolver: function(resolve, reject) {

			this.resolve = resolve;
			this.reject = reject;

			var feedConfig = {
				userId: 1,
				size: 2
				//, maxFeedId: 577297274625200100
			};

			var feedFromCacheCallback = function(err, result) {
				if (err) {
					logger.error(err);
					this.reject(err);
					return;
				}

				if (result.length) {
					this.respond(result);
					return;
				}

				feedConfig.size = MAX_COUNT;
				this.getFeedFromAPI(feedConfig, this.feedAPICallback);

			};

			this.getFeedFromCache(feedConfig, feedFromCacheCallback.bind(this));

		},

		getFeedFromCache: function(feedConfig, callback) {
			var _this = this;
			setImmediate(function nextTick() {
				twitterCacheModelHelper.getTwitterFeed(feedConfig, function(err, results) {
					if (err) {
						callback(err, null);
						return;
					}
					callback(null, results);
				});
			});
		},

		getFeedFromAPI: function(feedConfig, callback) {

			var T = new Twit({
				consumer_key: 'cghIPQ5xAS8H3WlDkyiURw',
				consumer_secret: 'KbVoamKQidrhk5tdo6HNHx8iKm8kANhkNMSOWr6EidQ',
				access_token: '16912759-3Ma5nGV1U3WD2zoN7c4Alj0jCgsDsMssaN3yXFBWT',
				access_token_secret: 'P22wjAeEnLXRAxVKbG4JzCjuAka0PMU3ldO87yrmZOlv3'
			});

			var data = {
				count: feedConfig.size || MAX_COUNT
			};

			if (feedConfig.maxFeedId) {
				data.max_id = feedConfig.maxFeedId;
			}

			T.get('statuses/home_timeline', data, callback.bind(this));
		},

		respond: function(result) {
			this.resolve(result);
		},

		feedAPICallback: function(err, result) {
			if (err) {
				logger.error(err);
				this.reject(err);
				return;
			}
			this.updateCache(result);

		},

		updateCache: function(result) {
			var _this = this;
			setImmediate(function nextTick() {
				twitterCacheModelHelper.insertTwitterFeeds(result, function(err, results) {
					if (err) {
						logger.error(err);
						_this.reject(err);
						return;
					}
					_this.respond(results);
				});
			});
		}
	};
	return core;
};

module.exports = function(req, config) {
	return twitterFeed(req, config).getFeed();
};

module.exports.MAX_COUNT = MAX_COUNT;