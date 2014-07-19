var _ = require('underscore');

var User = require('models/user-model'),
	util = require('helpers/util-helper');

var logger = util.getLogger();
		
var userHelper = function(req, res){

	return {
		isAuthenticated: function(){
			return req.isAuthenticated();
		},

		logout: function(){
			req.logOut();
			res.redirect('/');
		},

		getUser: function(){
			return req.user;
		}
	};
};	

module.exports = {
	init: function(){
		return function(req, res, next){
			req.userhelper = userHelper(req, res);

			if (next) return next();
		}
	},

	create: function(userData, callback){
		var newUser = new User();
		newUser = _.extend(newUser, userData);
		
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
	}
};