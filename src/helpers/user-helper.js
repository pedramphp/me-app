var userHelper = function(req, res, next){
	global.text = Math.random() * 100;
	console.log(global.text);
	next && next();
};


module.exports = userHelper;