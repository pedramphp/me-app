var passport = require('passport'),
	express = require('express'),
    passportFacebook = require('passport-facebook');


var FacebookStrategy = passportFacebook.Strategy,
	loginConfig = require('config/login-config'),
	userHelper = require('helpers/user-helper'),
	util = require('helpers/util-helper');
	
var logger = util.getLogger();

var main = (function(){

	var 
	User,
	config;

	return {
		init: function(app){

			// initializing the app with middlewears
			this.initApp(app);

			config = loginConfig.getConfig();
			
			User = require('models/user-model');
			
			this.initFb();
		},

		initApp: function(app){
			app.use(express.cookieParser());

			app.use(express.session({
			    secret: 'asdasdasdasdasdasd'
			}));

			app.use(passport.initialize());
			
			app.use(passport.session());

			
			passport.serializeUser(function(user, done){
				done(null, user.id);
			});

			passport.deserializeUser(function(id, done){
				User.findOne(id, function(err, user){
					done(err, user);	
				})
			});
		},

		initFb: function(){
			var fbStrategyConfig = {
				clientID:		config.FB.APP_ID,
				clientSecret:	config.FB.APP_SECRET,
				callbackURL:	config.FB.CALLBACK_URL
			};

			var fbInstance = new FacebookStrategy(fbStrategyConfig, this.fbCallback.bind(this));

			//Adding facebook strategy was 
			passport.use(fbInstance);
		},

		fbCallback: function(accessToken, refreshToken, profile, done){

			process.nextTick(this.getUserFromFb.bind(this, accessToken, refreshToken, profile, done));

		},

		getUserFromFb: function(accessToken, refreshToken, profile, done){

			var query = User.findOne({
				fbId: profile.id
			});

			console.log(profile);

			query.exec(function(err, user){
				if (err){
					util.logger.error( err );
					return;
				}

				if(user){
					logger.info({
						stack: logger.trace(), 
						msg: 'Existing User ' + user.first_name + ' found  and loggin in'
					});

					done(null, user);
					return;
				}

				var json = profile._json;

				var userHelperConfig = {
					fbId:		profile.id,
					bio:		json.bio,
					gender:		json.gender,
					birthday:	json.birthday,
					timezone:	json.timezone,
					first_name: json.first_name,
					last_name:	json.last_name,
					email:		profile.emails[0].value
				};

				userHelper.create(userHelperConfig, function(err, newUser){
					if (err){
						util.logger.error( err );
						return;
					}
					done( null, newUser);
				});
				
			});			
		}


	}

}());

module.exports = main;
