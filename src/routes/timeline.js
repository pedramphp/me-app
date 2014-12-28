'use strict';

var timeline = require('src/controllers').timeline;

module.exports = function(req, res){


	timeline(req).then(function(viewModel){

		res.render('pages/timeline', viewModel);
		
	});
};