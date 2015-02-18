'use strict';

var timeline = require('src/controllers').timeline;

module.exports = function(req, res){


	timeline(req).then(function(viewModel){
		//res.json(viewModel);
		//return;
		res.render('pages/timeline', viewModel);
	});
};