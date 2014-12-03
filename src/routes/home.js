'use strict';

module.exports = function(req, res){

	res.render('pages/home', {
        isDev: process.env.NODE_ENV === "development",
		title: 'About Me',
		data: {
			title: 'this is a title wow',
			conf: require('src/config/login-config')
		},
		language: 'en',
		en:{
			LOGIN: 'Log in Now',
			SIGNUP: 'Register',
			EMAIL_SIGNIN: 'Sign in using Email',
			FACEBOOK_BUTTON: 'Continue with facebook',
			PAGE_DESCRIPTION: 'Be in your all Social Networks in one place',
			ALREADY_HAVE_ACCOUNT: 'Already have an account?'
		},
		helpers:{},
        layout: 'main',

	});
};