"use strict";

var InstagramCacheModel = require('src/models').getInstagramCache();
var util = require('src/utils');
var logger = require('src/utils').logger(module);

function InstagramCache() {}

var proto = InstagramCache.prototype;

proto.insertInstagramFeeds = function(feeds, callback) {
	var result = [];
	var totalFeeds = feeds.length;
	var _this = this;

	var updateRecords = function(record) {
		result.push(record);

		if (totalFeeds) {
			insertFeed();
		} else {
			callback(null, result);
		}
	};

	var insertFeed = function() {
		var feed = feeds.pop();
		var userId = 1;
		totalFeeds--;

		_this.findInstagramFeed(userId, feed.id, function(err, aFeed) {
			if (err) {
				callback(err, null);
				return;
			}
			var record = new InstagramCacheModel({
				user_id: userId,
				feed_id: feed.id,
				feed: feed
			});

			if (aFeed) {
				logger.info({
					msg: 'InstagramFeedRecord:' + record.feed_id + ' Already Exist'
				});
				updateRecords(record);
				return;
			}

			record.save(function(err) {
				if (err) {
					callback(err, null);
					return;
				}
				updateRecords(record);
				logger.info({
					msg: 'New InstagramFeedRecord:' + record.feed_id + ' created'
				});

			});
		});
	};

	insertFeed();
};

proto.findInstagramFeed = function(userId, feedId, done) {

	var query = InstagramCacheModel.findOne({
		user_id: userId,
		feed_id: feedId
	});

	query.exec().then(function(feed) {
		done(null, feed || null);
	});

};


proto.getInstagramFeed = function(options, done) {

	var config = {
		user_id: options.userId
	};

	if (options.maxFeedId) {
		config.feed_id = {
			$lt: options.maxFeedId
		};
	}

	var query = InstagramCacheModel
		.find(config)
		.limit(options.size || 10);

	query.exec().then(function(feeds) {
		done(null, feeds || null);
	});
};

module.exports = InstagramCache;