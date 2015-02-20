"use strict";
var passport = require('passport');

var cookieParser = require('cookie-parser');
var session = require('express-session');

var logger    = require('src/utils').logger;

var core = {};

/**
 * Initialize passport.js
 *
 *   - setup default configuration
 *   - setup default middleware
 *
 *  @api private
 */

core.init = function(app){

	var UserModel = require('src/models').getUser();

	app.use(cookieParser());

	app.use(session({
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
		UserModel.findOne(id, function(err, user){
			done(err, user);
		});
	});

	try{
		//load facebook strategy passport module.
		require('src/modules/passport').facebook( passport );
	}catch(e){
		logger.error(e);
	}
};

module.exports = function(app){
	core.init(app);
};
