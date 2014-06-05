'use strict';

module.exports = function(req, res){

	res.render('pages/email-login', {
		isDev: process.env.NODE_ENV === "development",
		title: 'Login with email',
		data: {
			title: 'Login with email'
		},
		helpers:{},
		layout: 'main'
	});

};