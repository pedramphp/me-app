'use strict';

var routes = function(){
	return {
		init: function( app, exposeTemplates){
			
			// set your route
			app.get('/', exposeTemplates, function(req, res){
				require('routes/home')(req, res);
			});
			
		}
	}
}();

module.exports = routes;