"use strict";

module.exports = {
	getUser: function(){
		return require('src/models/User');
	},

	getTwitterCache: function(){
		return require('src/models/TwitterCache');
	}
	
};