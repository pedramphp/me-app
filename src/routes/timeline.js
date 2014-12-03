'use strict';

module.exports = function(req, res){

	res.render('pages/timeline', {
        isDev: process.env.NODE_ENV === "development",
		title: 'Timeline',
		data: {
			title: 'Your timeline',
			conf: require('src/config').login
		},
		helpers:{},
        layout: 'main',

	});
};