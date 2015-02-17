"use strict";

var passportFacebook = require('passport-facebook');

var config = require('src/config').login();

var UserModelHelper = require('src/model-helpers').UserModelHelper;

var userModelHelper = new UserModelHelper();

var facebook = function(passport){


	var fbConfig = {
		clientID:		config.FB.APP_ID,
		clientSecret:	config.FB.APP_SECRET,
		callbackURL:	config.FB.CALLBACK_URL
	};


	return {
		init: function(){

			var FacebookStrategy = passportFacebook.Strategy;

			var fbInstance = new FacebookStrategy(fbConfig, this.fbStrategyCallback.bind(this));

			//Adding facebook strategy to passport
			passport.use(fbInstance);
		},

		fbStrategyCallback: function(accessToken, refreshToken, profile, done){
			var self = this;

			setImmediate(function nextTick(){

				userModelHelper.findOrCreateByFacebook({
					profile: profile,
					accessToken: accessToken
				}, function cb(err, user){
					done(err, user);
				});
			});
		}
	};
};

module.exports = function(passport){

	var fb = facebook(passport);

	fb.init();

};
