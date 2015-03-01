'use strict';

module.exports = function(req, res){

	res.render('pages/welcome', {
        isDev: process.env.NODE_ENV === "development",
		title: 'Welcome To Mergify',
		data: {
			title: 'this is a title wow',
			conf: require('src/config').login
		},
		helpers:{},
        layout: 'main',

	});
};