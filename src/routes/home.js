'use strict';

module.exports = function(req, res){

	res.render('pages/home', {
	        isDev: process.env.NODE_ENV === "development",
			title: 'About Me',
			data: {
				title: 'this is a title'
			},
			helpers:{},
	        layout: 'main'
	});

};