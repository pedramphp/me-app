"use strict";

var TwitterCacheModel = require('src/models').getTwitterCache();
var util = require('src/utils');
var logger = require('src/utils').logger(module);

function TwitterCache(){}

var proto = TwitterCache.prototype;

proto.insertTwitterFeeds = function(feeds, callback){
	var result = [];
	var totalFeeds = feeds.length;
	var _this = this;

	var updateRecords = function(record){
		result.push(record);

		if(totalFeeds){
			insertFeed();
		}else{
			callback( null, result);
		}
	};

	var insertFeed = function(){
		var feed = feeds.pop();
		var userId = 1;
		totalFeeds--;

		_this.findTwitterFeed(userId, feed.id, function(err, aFeed){
			if (err){
				callback(err, null);
				return;
			}
			var record = new TwitterCacheModel({
				user_id: userId,
				feed_id: feed.id,
				feed: feed
			});

			if(aFeed){
				logger.info({
					msg: 'TwitterFeedRecord:' + record.feed_id + ' Already Exist'
				});
				updateRecords(record);
				return;
			}

			record.save(function(err){
				if (err){
					callback(err, null);
					return;
				}
				updateRecords(record);
				logger.info({
					msg: 'New TwitterFeedRecord:' + record.feed_id + ' created'
				});
		
			});
		});
	};

	insertFeed();
};

proto.findTwitterFeed = function(userId, feedId, done){

	var query = TwitterCacheModel.findOne({
		user_id: userId,
		feed_id: feedId
	});

	query.exec().then(function(feed){
		done(null, feed || null);
	});

};


proto.getTwitterFeed = function(options, done){

	var config = {
		user_id: options.userId
	};

	if(options.maxFeedId){
		 config.feed_id = { 
		 	$lt: options.maxFeedId 
		 };
	}

	var query = TwitterCacheModel
					.find(config)
					.limit(options.size || 10);

	query.exec().then(function(feeds){
		done(null, feeds || null);
	});	
};

module.exports = TwitterCache;
