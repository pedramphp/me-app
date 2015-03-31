"use strict";

var mongoose =  require('mongoose'),
	config = require('src/config').login();

mongoose.connect(config.DB.URL);

var userSchema =  new mongoose.Schema({
	fb_id: String,
	email: {
		type: String,
		lowercase: true,
		required: true
	},
	first_name: {
		type: String,
		lowercase: true
	},
	last_name: {
		type: String,
		lowercase: true
	},
	fb_access_token: String,
	ig_access_token: String,
	ig_id: String,
	twitter_id: String,
	twitter_access_token: String,
	twitter_access_token_secret: String,
	fb_status: String,
	twitter_status: String,
	ig_status: String
});

var UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;