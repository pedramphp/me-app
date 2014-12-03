"use strict";

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

module.exports = function(){
	return settings.development;
};