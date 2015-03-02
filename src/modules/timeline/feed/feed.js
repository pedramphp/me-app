"use strict";

var Promise = require("bluebird");
var logger = require('src/utils').logger();
var facebookFeed = require('src/modules/timeline/feed/facebook');
var instagramFeed = require('src/modules/timeline/feed/instagram');
var twitterFeed = require('src/modules/timeline/feed/twitter');

var feed = function feed(req) {

 	var promiseCallback = function(resolve, reject) {
  
  		twitterFeed(req)
	  		.then(function(dataModel){
	  			resolve(dataModel);
	  		}).catch(function(error){
	  			reject(error);
	  		});
	};

  return new Promise(promiseCallback);
};

module.exports = function(req) {
  return feed(req);
};