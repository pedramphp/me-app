'use strict';

module.exports = function(req, res){


	res.render('pages/email/verify', {
        isDev: process.env.NODE_ENV === "development",
		title: 'Email Verification',
		data: {
			title: 'Email Verification'
		},
		helpers:{},
        layout: 'email'
	});

};