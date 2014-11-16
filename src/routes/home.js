'use strict';

module.exports = function(req, res){

	res.render('pages/home', {
        isDev: process.env.NODE_ENV === "development",
		title: 'About Me',
		data: {
			title: 'this is a title wow',
			conf: require('config/login-config')
		},
		language: 'en',
		en:{
			facebook_button: 'Continue with facebook',
			signup: 'Register',
			page_description: 'Be in your all Social Networks in one place',
			login: 'Log in Now',
			already_have_account: 'Already have an account?',
			email_signin: 'Sign in using Email'
		},
		helpers:{},
        layout: 'main',

	});
};