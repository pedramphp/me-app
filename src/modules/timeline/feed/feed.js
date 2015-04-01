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

var PAGE_SIZE = 20;

var feed = function feed(req) {

	var core = {
		user: null,
		resolve: null,
		reject: null,
		networks: [],
		feeds: [],
		twitter: {
			TITLE: "TWITTER",
			count: 0,
			lastIndex: 0,
			lastId: null,
			isAvailable: true,
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

				return twitterFeed(req, this.config)
						.catch(function( error ){
							_this.isAvailable = false;
						});
			},
			
			feedCallback: function(feeds){
				/*return feeds;
				
				var _this = this;
				this.lastId = null;
				feeds.forEach(function(feed) {
					var item = feed.feed;
					var date = new Date(item.created_at);

					core.feeds.push({
						created_time: date.valueOf(),
						type: "twitter",
						item: item,
						id: item.id,
						created_time_string: moment(item.created_at).format('MMMM Do YYYY, h:mm:ss a')
				
					});
				});
				
				this.count = (feeds.data && feeds.data.length) || 0;
				
				feeds.forEach(function(feed) {
					core.feeds.push({
						type: "twitter",
						feed: feed
					});
				});
				*/


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
				feeds.forEach(function(feed, index, arr){
					feed.network = network;
				});
				return feeds;
			});
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
					console.log(result.reason());
				}
			});

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