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
var passport = require('passport');

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();

    }
    res.redirect('/');
}


var routes = function(){
	return {
		init: function( app, exposeTemplates){

			app.use(app.router);

			// set your route
			app.get('/', exposeTemplates, function(req, res){
				if(req.isAuthenticated()){
					require('routes/timeline')(req, res);
				}else{
					require('routes/home')(req, res);		
				}
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

			app.get('/auth/facebook', passport.authenticate('facebook', { 
				scope: 'email',
				display: 'page' //https://developers.facebook.com/docs/reference/dialogs/oauth/ find more info here.
			}));


			app.get('/auth/facebook/callback', passport.authenticate('facebook', { 
				failureRedirect: '/'
			}), function(req, res){
				 res.redirect('/');
			});


			app.get('/logout', function(req, res){
				req.logOut();
				res.redirect('/');
			});

			app.get('/main', ensureAuthenticated, function(){
				console.log('loaded');
			});

		}
	}
}();

module.exports = routes;