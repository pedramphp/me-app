var config = function(){
		
	var settings = {
		development:{
			fb:{
				appId: '261731650641340',
				appSecret: 'a5bde0c5259b063357b932cfd03b616c',
				url: 'http://localhost:5000' 
			},
			db:{
				url: 'mongodb://localhost/me'
			}
		}
	};

	return {
		init: function(req, res){
			return settings;
		}
	};

}();

module.exports = config.init.bind(config)();