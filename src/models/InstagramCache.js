"use strict";

var mongoose = require('mongoose'),
	config = require('src/config').login();

var instagramCacheSchema = new mongoose.Schema({
	user_id: String,
	feed_id: String,
	feed: Object
});

var InstagramCacheModel = mongoose.model('InstagramCache', instagramCacheSchema);

module.exports = InstagramCacheModel;