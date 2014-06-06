'use strict';

module.exports = function(req, res){

	res.render('pages/signup', {
		isDev: process.env.NODE_ENV === "development",
		title: 'Signup in ME',
		data: {
			title: 'Signup'
		},
		helpers:{},
		layout: 'main'
	});

};