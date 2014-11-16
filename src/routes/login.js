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
			SIGNIN: 'Sign in',
			FORGOTPASS: 'Forgot your password',
			SIGNUP: 'Create an Account',
			FACEBOOK_BUTTON: 'Continue with facebook'		
		},
		layout: 'main'
	});

};