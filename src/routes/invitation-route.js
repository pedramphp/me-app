'use strict';

module.exports = function(req, res){


	res.render('pages/email/invitation', {
        isDev: process.env.NODE_ENV === "development",
		title: 'Invitation Email Template',
		data: {
			title: 'Invitation Email'
		},
		helpers:{},
        layout: 'email'
	});

};