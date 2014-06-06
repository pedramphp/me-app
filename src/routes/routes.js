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

			app.get('/login', function(req, res){
				require('routes/login')(req, res);
			});

			app.get('/signup', function(req, res){
				require('routes/signup')(req, res);
			});

			app.get('/comps', function(req, res){
				require('routes/comps')(req, res);
			});

			app.get('/email/invitaion', function(req, res){
				require('routes/invitation')(req, res);
			});

			app.get('/email/verify', function(req, res){
				require('routes/verify')(req, res);
			});

			app.get('/email/forgot', function(req, res){
				require('routes/forgot')(req, res);
			});
			
		}
	}
}();

module.exports = routes;