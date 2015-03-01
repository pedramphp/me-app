"use strict";

var _ = require('underscore');

var User = require('src/models').getUser(),
	logger = require('src/utils').logger();


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
	init: function(req, res, next){
		req.userhelper = userHelper(req, res);

		if (next) return next();
	}
};