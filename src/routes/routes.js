'use strict';
/*
is_desktop	It returns true in case the device type is "desktop"; false otherwise
is_phone	It returns true in case the device type is "phone"; false otherwise
is_tablet	It returns true in case the device type is "tablet"; false otherwise
is_mobile	It returns true in case the device type is "phone" or "tablet"; false otherwise
is_tv	It returns true in case the device type is "tv"; false otherwise
is_bot	It returns true in case the device type is "bot"; false otherwise
device_type	It returns the device type string parsed from the request
*/
var routes = function(){
	return {
		init: function( app, exposeTemplates){

			app.use(app.router);

			// set your route
			app.get('/', exposeTemplates, function(req, res){
				require('routes/home')(req, res);
			});

			// set your route
			app.get('/comps', exposeTemplates, function(req, res){
				require('routes/comps')(req, res);
			});

			app.get('/email/invitaion', exposeTemplates, function(req, res){
				require('routes/invitation')(req, res);
			});
			
		}
	}
}();

module.exports = routes;