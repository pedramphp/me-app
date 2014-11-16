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
			signin: 'Sign in',
			forgotpass: 'Forgot your password',
			signup: 'Create an Account',
			facebook_button: 'Continue with facebook'		
		},
		layout: 'main'
	});

};