'use strict';

module.exports = function(req, res){


	res.render('pages/email/forgot', {
        isDev: process.env.NODE_ENV === "development",
		title: 'Forgot Password Email Template',
		data: {
			title: 'Forgot Password Email Template'
		},
		helpers:{},
        layout: 'email'
	});

};