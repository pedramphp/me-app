"use strict";

var Promise = require("bluebird"),
	moment = require("moment"),
	_ = require("underscore");


var logger = require('src/utils').logger(module);

var facebookFeed = require('src/modules/timeline/feed/facebook'),
	instagramFeed = require('src/modules/timeline/feed/instagram'),
	twitterFeed = require('src/modules/timeline/feed/twitter');


var FACEBOOK = "fb",
	INSTAGRAM = "ig",
	TWITTER = "twitter",
	STATUS = "_status";

var SOCIAL_LIST_DB_FEILD = [
	FACEBOOK + STATUS, 
	INSTAGRAM + STATUS, 
	TWITTER + STATUS
];

var TimeoutError = Promise.TimeoutError;

var PAGE_SIZE = 20;
var timeout = 200;

var feed = function feed(req) {

	var core = {
		user: null,
		resolve: null,
		reject: null,
		networks: [],
		feeds: [],
		twitter: {
			count: 0,
			lastIndex: 0,
			lastId: null,
			markdown: false,
			RETRIES: 3,
			config:{
				accessToken: null,
				accessTokenSecret: null
			},

			init: function(config){
				_.extendOwn(this.config, config || {});
			},

			getPromise: function(){
				var _this = this;

				if(this.lastId){
					this.config.lastId = this.lastId;
				}

				var twitterFeedPromise = function(retries){
					if(!retries){
						retries = 0;
					}

					return twitterFeed(req, _this.config)
						.timeout(timeout)
						.catch(TimeoutError, function(e) {
							if (retries < _this.RETRIES) {
								return twitterFeedPromise(retries + 1);
							}
							else {
								logger.error("couldn't fetch twitter content after 5 timeouts, timeout:" + timeout) ;
								_this.markdown = true;
							}
						})
						.catch(function( error ){
							logger.error("twitter failed" + error);
							_this.markdown = true;
						});
				};

				return twitterFeedPromise();
			}
		},

		getFeed: function() {
			return new Promise(this.resolver.bind(this));
		},

		registerNetworks: function(){
			SOCIAL_LIST_DB_FEILD.forEach(function(social, index){
				if(this.user[social] && this.user[social] === 'connected'){
					this.networks.push(social.split(STATUS)[0]);
				}
			}.bind(this));
		},

		processFeed: function(){
			//logger.info(this.feeds.length);
			this.resolve(this.feeds);
		},

		getNetworkConfig: function(network){
			if(network === TWITTER){
				return {
					accessToken: this.user.twitter_access_token,
					accessTokenSecret: this.user.twitter_access_token_secret
				};
			}
		},

		getNetworkPromise: function(promise, network){
			return promise.then(function networkPromiseCallback(feeds){
				feeds.forEach(function(feedInstance, index, arr){
					feedInstance.network = network;
					if(network === TWITTER){
						var date = new Date(feedInstance.feed.created_at);
						feedInstance.created_time = date.valueOf();
					}
				});

				return feeds;
			});
		},

		sortFeedByTime: function(){
			if(this.feeds.length){
				this.feeds = this.feeds.sort(function(feedA, feedB){
					return feedB .created_time - feedA.created_time;
				});
			}
		},

		allPromiseCallback: function(results){
			var _this = this;

			results.forEach(function(result){
				var feeds;
				if(result.isFulfilled){
					feeds = result.value();
					if(feeds.length){
						_this.feeds = _this.feeds.concat( feeds );
					}
				} else if (result.isRejected()){
					logger.error(result.reason());
				}
			});

			// sort feed to set indexes
			this.sortFeedByTime();

			if(PAGE_SIZE >= this.feeds.length){
				console.log("less than page size");
			}

			this.feeds = this.feeds.slice(0, PAGE_SIZE);

			this.processFeed();	
		},

		resolver: function(resolve, reject) {
			var _this = this;
			this.resolve = resolve;
			this.reject = reject;

			// get user object.
			this.user = req.userhelper.getUser();

			//push registered networks to `this.networks` array
			this.registerNetworks();

			var promises = [];
			var promise;

			//loop through each network and create promises to get feeds
			this.networks.forEach(function(network){
				//set API Configuration.
				this[network].init(this.getNetworkConfig(network));
				promise = this.getNetworkPromise(this[network].getPromise(), network);
				promises.push(promise);
			}.bind(this));

			Promise
				.settle(promises)
				.then(this.allPromiseCallback.bind(this));
		},

	};
	return core;

};

module.exports = function(req) {
	return feed(req).getFeed();
};