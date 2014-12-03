"use strict";
var passport = require('passport'),
	express = require('express'),
    passportFacebook = require('passport-facebook');


var FacebookStrategy = passportFacebook.Strategy,
	loginConfig = require('src/config').login(),
	userHelper = require('src/helpers/user-helper');

var logger = require('src/utils').logger;

var main = (function(){

	var
	User,
	config;

	return {
		init: function(app){

			// initializing the app with middlewears
			this.initApp(app);

			config = loginConfig;

			User = require('src/models').getUser();

			this.initFb();
		},

		initApp: function(app){
			app.use(express.cookieParser());
			app.use(express.session({
			    secret: 'THIS_IS_SECRET',
				cookie: {
					maxAge: 2 * 60 * 1000
				}
			}));

			app.use(passport.initialize());

			app.use(passport.session());


			passport.serializeUser(function(user, done){
				done(null, user.id);
			});

			passport.deserializeUser(function(id, done){
				User.findOne(id, function(err, user){
					done(err, user);
				});
			});
		},

		initFb: function(){
			var fbStrategyConfig = {
				clientID:		config.FB.APP_ID,
				clientSecret:	config.FB.APP_SECRET,
				callbackURL:	config.FB.CALLBACK_URL
			};

			var fbInstance = new FacebookStrategy(fbStrategyConfig, this.fbCallback.bind(this));

			//Adding facebook strategy to passport
			passport.use(fbInstance);
		},

		fbCallback: function(accessToken, refreshToken, profile, done){

			process.nextTick(
				this.getUserFromFb.bind(this, accessToken, refreshToken, profile, done)
			);

		},

		getUserFromFb: function(accessToken, refreshToken, profile, done){

			var query = User.findOne({
				fb_id: profile.id
			});

			query.exec(function(err, user){
				if (err){
					logger.error({
						stack: logger.trace(),
						msg: err
					});
					return;
				}

				// if user is found return it.
				if(user){
					logger.info({
						stack: logger.trace(),
						msg: 'Existing User ' + user.first_name + ' found  and loggin in'
					});
					done(null, user);
					return;
				}

				// if the user is not found, create it.

				var json = profile._json;

				if(!json || !util._.isObject(json)){
					return;
				}

				var userHelperConfig = {
					fb_id:		profile.id,
					bio:		json.bio,
					gender:		json.gender,
					birthday:	json.birthday,
					timezone:	json.timezone,
					first_name: json.first_name,
					last_name:	json.last_name,
					email:		profile.emails && profile.emails.length && profile.emails[0].value || ''
				};

				userHelper.create(userHelperConfig, function(err, newUser){
					if (err){
						logger.error({
							stack: logger.trace(),
							msg: err
						});

						return;
					}
					done( null, newUser);
				});
			});
		}
	};

}());

module.exports = main;
