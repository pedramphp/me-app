"use strict";
var config = function(){

	var settings = {
		development:{
			FB:{
				APP_ID:			'261731650641340',
				APP_SECRET:		'a5bde0c5259b063357b932cfd03b616c',
				CALLBACK_URL:	'http://localhost:5000/auth/facebook/callback'
			},
			DB:{
				URL: 'mongodb://localhost/me'
			}
		}
	};

	return {
		init: function(req, res){
			return settings;
		},

		getConfig: function(){
			return settings.development;
		}
	};
}();

module.exports = config;
