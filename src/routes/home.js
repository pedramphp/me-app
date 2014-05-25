'use strict';

module.exports = function(req, res){
	var ua = req.headers['user-agent'],
		isMobile = false;

	if (/mobile/i.test(ua)){
    	isMobile = true;
	}

	res.render('pages/home', {
	        isDev: process.env.NODE_ENV === "development",
			title: 'About Me',
			data: {
				title: 'this is a title'
			},
			helpers:{},
	        layout: 'main',
	        isMobile: isMobile,
	        isDesktop: !isMobile
	});

};