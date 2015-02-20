'use strict';

module.exports = function(req, res){

	res.render('pages/invite-msg', {
        isDev: process.env.NODE_ENV === "development",
		title: 'Invitation has been sent',
		data: {
			title: 'this is a title wow',
			conf: require('src/config').login
		},
		helpers:{},
        layout: 'main',

	});
};