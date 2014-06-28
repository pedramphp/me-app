var mongoose =  require('mongoose'),
	config = require('config/login-config').getConfig();

mongoose.connect(config.DB.URL);

var userSchema =  new mongoose.Schema({
	fbId: String,
	name: String,
	email: {
		type: String,
		lowercase: true
	},
	first_name: {
		type: String,
		lowercase: true
	}
});

var UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
