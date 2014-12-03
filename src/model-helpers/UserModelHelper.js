"use strict";

var UserModel = require('src/models').getUser();
var util = require('src/utils');
var logger = require('src/utils').logger;

// TODO: need to use Q.js and promises to optimize the code.

var userQueryCallback = function(user, err){

	if (err){
		logger.error(err);
	}

	// if user is found return it.
	if(user){
		logger.info({
			stack: logger.trace(),
			msg: 'Existing User ' + user.first_name + ' found  and loggin in'
		});

		return user;
	}

	return null;
};


var getUserConfigFromFb = function(profile){
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
		email:		json.email || ''
	};

};

function UserModelHelper(){};

UserModelHelper.prototype.createUser = function(userData, callback){
	var newUser = new UserModel();
	newUser = util._.extend(newUser, userData);

	newUser.save(function(err){
		if (err){
			callback(err, null);
		}

		logger.info({
			stack: logger.trace(),
			msg: 'New user:' + newUser.first_name + 'created and logged in!'
		});

		callback( null, newUser);
	});
};

UserModelHelper.prototype.getUserByFacebookId = function(profile, done){

	var self =  this;

	if(!profile.id){
		logger.error({
			stack: logger.trace(),
			msg: "There is no `id` found in the profile object."
		});
	}

	var query = UserModel.findOne({
		fb_id: profile.id
	});

	var fail =function(error){
		logger.error({
			stack: logger.trace(),
			msg: err
		});
	};

	query.exec()
		.then(userQueryCallback, fail)
		.then(function(user){

			// if user is found return it
			if(user){
				done(null, user);
				return true;
			}

			return !!user;

		}, fail).then(function(userFound){

			// if user is found don't do anything
			if(userFound){
				return;
			}

			// create a new user in the DB
			var config = getUserConfigFromFb( profile );
			
			if(!config){
				logger.error('Config object is null/invalid for createUserConfigFromFb');
			}

			self.createUser(config, function(err, newUser){
				if (err){
					logger.error(err);
				}

				done( null, newUser);
			});

		}, fail);

};


module.exports = UserModelHelper;