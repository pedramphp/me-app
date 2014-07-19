var userHelper = function(req, res){

	return {
		isAuthenticated: function(){
			return req.isAuthenticated();
		},

		logout: function(){
			req.logOut();
			res.redirect('/');
		},

		getUser: function(){
			return req.user;
		}
	};
};	

module.exports = {
	init: function(){
		return function(req, res, next){
			req.userhelper = userHelper(req, res);

			if (next) return next();
		}
	}
};