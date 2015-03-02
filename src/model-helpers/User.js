"use strict";

var UserModel = require('src/models').getUser();
var util = require('src/utils');
var logger = require('src/utils').logger();

// TODO: need to use Q.js and promises to optimize the code.

var userQueryCallback = function(user, err){

	if (err){
		logger.error(err);
	}

	// if user is found return it.
	if(user){
		logger.info({
			msg: 'Existing User ' + user.first_name + ' found  and loggin in'
		});

		return user;
	}

	return null;
};


var getUserConfigFromFb = function(profile, accessToken){
	var json = profile._json;

	if(!json || ! util._.isObject(json)){
		return null;
	}

	return {
		fb_id:		json.id,
		bio:		json.bio,
		gender:		json.gender,
		birthday:	json.birthday,
		timezone:	json.timezone,
		first_name: json.first_name,
		last_name:	json.last_name,
		email:		json.email || '',
		fb_access_token: accessToken
	};

};

function User(){}

var proto = User.prototype;

proto.createUser = function(userData, callback){
	var newUser = new UserModel();
	newUser = util._.extend(newUser, userData);

	newUser.save(function(err){
		if (err){
			callback(err, null);
		}

		logger.info({
			msg: 'New user:' + newUser.first_name + ' created and logged in!'
		});

		callback( null, newUser);
	});
};

proto.findOrCreateByFacebook = function(data, done){
	var profile = data.profile;
	var accessToken = data.accessToken;

	var self =  this;

	if(!profile.id){
		logger.error({
			msg: "There is no `id` found in the profile object."
		});
	}

	var query = UserModel.findOne({
		fb_id: profile.id
	});

	var fail = function(error){
		logger.error({
			msg: error
		});
	};

	var userQueryCallback = function(user){
		if(user){
			done(null, user);
			return;
		}

		var config = getUserConfigFromFb( profile, accessToken );

		if(!config){
			logger.error('Config object is null/invalid for createUserConfigFromFb');
		}

		self.createUser(config, function(err, newUser){
			if (err){
				logger.error(err);
			}

			done( null, newUser);
		});

	};

	query.exec().then(userQueryCallback);

};

module.exports = User;
