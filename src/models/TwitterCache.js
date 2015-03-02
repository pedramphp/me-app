"use strict";

var mongoose =  require('mongoose'),
	config = require('src/config').login();

//mongoose.connect(config.DB.URL);

var twitterCacheSchema =  new mongoose.Schema({
	user_id: String,
	feed_id: String,
	feed: Object
});

var TwitterCacheModel = mongoose.model('TwitterCache', twitterCacheSchema);

module.exports = TwitterCacheModel;