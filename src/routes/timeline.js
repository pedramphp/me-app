'use strict';

module.exports = function(req, res){

	res.render('pages/timeline', {
        isDev: process.env.NODE_ENV === "development",
		title: 'Timeline',
		data: {
			title: 'Your Timeline'
		},
		helpers:{},
        layout: 'main'
	});

};