var passport = require('passport'),
	express = require('express'),
    passportFacebook = require('passport-facebook');


var FacebookStrategy = passportFacebook.Strategy,
	loginConfig = require('config/login-config'),
	util    = require('helpers/util-helper');

var main = (function(){

	var User,
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

			query.exec(function(err, oldUser){
				if (err) throw err;
				if(oldUser){
					console.log('Existing User ' + oldUser.first_name + ' found  and loggin in');
					done(null, oldUser);
					return;
				}

				var newUser = new User();
				newUser.fbId =  profile.id;
				newUser.first_name =  profile._json.first_name;
				newUser.last_name =  profile._json.last_name;
				newUser.gender = profile._json.gender;
				newUser.birthday = profile._json.birthday;
				newUser.timezone = profile._json.timezone;
				newUser.bio = profile._json.bio;

				newUser.email = profile.emails[0].value;

				newUser.save(function(err){
					if (err) throw err;
					console.log('New user:' + newUser.name + 'created and logged in!');
					done( null, newUser);
				});
				
			});			
		}


	}

}());

module.exports = main;