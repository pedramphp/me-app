"use strict";

var Promise = require("bluebird");
var graph = require('fbgraph');

var logger = require('src/utils').logger(module);

var MAX_COUNT = 200;

var InstagramCacheModelHelper = require('src/model-helpers').InstagramCacheModelHelper;

var instagarmCacheModelHelper = new InstagramCacheModelHelper();

var igFeed = function feed(req, config) {

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
					//, maxFeedId: 572244458948837400
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

				instagarmCacheModelHelper.getInstagramFeed(feedConfig, function(err, results) {
					if (err) {
						callback(err, null);
						return;
					}
					callback(null, results);
				});
			});
		},

		getFeedFromAPI: function(feedConfig, callback) {

			var ig = require('instagram-node').instagram({});
			ig.use({
				access_token: '353722391.71c7cf4.b715204c2d004c84ae7330ad582abb1b'
			});

			ig.user_self_feed(callback.bind(this));

		},

		respond: function(result) {
			this.resolve(result);
		},

		feedAPICallback: function(err, result, remaining, limit) {
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

				instagarmCacheModelHelper.insertInstagramFeeds(result, function(err, results) {
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
	return igFeed(req, config).getFeed();
};