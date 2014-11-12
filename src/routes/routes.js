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
			app.get('/auth/facebook', passport.authenticate('facebook', {
				scope: 'email',
				display: 'page' //https://developers.facebook.com/docs/reference/dialogs/oauth/ find more info here.
			}));


			app.get('/', exposeTemplates, function (req, res){
                console.log('expires in: ' + (req.session.cookie.maxAge / 1000) + 's');

                if(req.userhelper.isAuthenticated()){
					require('routes/timeline-route')(req, res);
				}else{
					require('routes/home-route')(req, res);
				}
			});

			app.get('/login', function(req, res){
				require('routes/login-route')(req, res);
			});

			app.get('/signup', function(req, res){
				require('routes/signup-route')(req, res);
			});

			app.get('/comps', function(req, res){
				require('routes/comps-route')(req, res);
			});

			app.get('/email/invitaion', function(req, res){
				require('routes/invitation-route')(req, res);
			});

			app.get('/email/verify', function(req, res){
				require('routes/verify-route')(req, res);
			});

			app.get('/email/forgot', function(req, res){
				require('routes/forgot-route')(req, res);
			});

			app.get('/timeline', function(req, res){
				require('routes/timeline-route')(req, res);
			});

			app.get('/auth/facebook/callback', passport.authenticate('facebook', {
				failureRedirect: '/'
			}), function(req, res){
				 res.redirect('/');
			});

			app.get('/logout', function(req, res){
				req.userhelper.logout();
			});

			app.get('/main', ensureAuthenticated, function(){
				console.log('loaded');
			});

		}
	};
}();

module.exports = routes;
