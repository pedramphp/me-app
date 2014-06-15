'use strict';

module.exports = function(req, res){

	res.render('pages/timeline', {
        isDev: process.env.NODE_ENV === "development",
		title: 'About Me',
		data: {
			title: 'this is a title wow',
			conf: require('config/login-config')
		},
		helpers:{},
        layout: 'main',

	});
};