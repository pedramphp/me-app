"use strict";

var mongoose =  require('mongoose'),
	config = require('src/config').login();

mongoose.connect(config.DB.URL);

var userSchema =  new mongoose.Schema({
	fb_id: String,
	email: {
		type: String,
		lowercase: true
	},
	first_name: {
		type: String,
		lowercase: true
	},
	last_name: {
		type: String,
		lowercase: true
	},
	fb_access_token:{
		type: String	
	}
});

var UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;