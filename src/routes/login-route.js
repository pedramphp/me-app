'use strict';

module.exports = function(req, res){

	res.render('pages/login', {
		isDev: process.env.NODE_ENV === "development",
		title: 'Login with email',
		data: {
			title: 'Login with email'
		},
		language: 'en',
		en:{
			signin: 'Signin',
			forgotpassword: 'Forgot your password',
			create_account: 'Create an Account'
		},
		layout: 'main'
	});

};