'use strict';

var routes = function(){
	return {
		init: function( app, exposeTemplates){
			
			// set your route
			app.get('/', exposeTemplates, function(req, res){
				require('routes/home')(req, res);
			});

			// set your route
			app.get('/comps', exposeTemplates, function(req, res){
				require('routes/comps')(req, res);
			});
			
		}
	}
}();

module.exports = routes;