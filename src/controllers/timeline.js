"use strict";

var Q = require('q');

var logger = require('src/utils').logger;

var timeline = require('src/modules/timeline/');

var Promise = require("bluebird");

var timelineModule = function(req){

	var response = {
		isDev: process.env.NODE_ENV === "development",
		title: 'Timeline',
		data: {
			title: 'Your timeline',
			conf: require('src/config').login(),
			timeline: {
				feed:[]
			}
		},
		helpers:{	
			isFb: function(type){
				return type === "fb";
			},

	        fbStatusMsg: function(msg){
				if(msg){
					return msg.replace(/#(\S*)/g, function(match, p1, offset, string){
						return "<a href='https://www.facebook.com/hashtag/" + p1 + "?source=feed_text' target='_blank' >"+ match +"</a>";
					});
				}else{
					return "";
				}
	        },

	        fbPostImage: function(img){
	            if(!img){
	                return "";
	            }
	            return img.replace("_s.jpg","_n.jpg");
	        },

	        fbCommentMoreTotal: function(totalComment){
	            totalComment = totalComment - 4;
	            if(totalComment < 0){
	                return 0;
	            }
	            return totalComment;
	        },

	        igMsg: function(msg){
				if(!msg){
					return "";
				}
				return msg.replace(/@(\S*)/g, function(match, p1, offset, string){
					return "<a href='http://instagram.com/" + p1 +"' target='_blank' >"+ match +"</a>";
				});
	        }
		},
	};

	var core = {
		resolve: null,
		reject: null,
		getFeed: function(){
			return new Promise(this.resolver.bind(this));
		},
		resolver: function(resolve, reject){

			this.resolve = resolve;
			this.reject = reject;

			var timelinePromise = timeline.friends(req);
			timelinePromise
				.then(this.success.bind(this))
				.catch(TypeError, this.error.bind(this))
				.catch(ReferenceError, this.error.bind(this))
				.catch(this.error.bind(this));

		},
		success: function(result){
			var record;
			if(result && result.data && result.data.length){
				result.data.forEach(function(post){
					record = {
						type: 'facebook'
					};
					record.posts = [
						post
					];
					response.data.timeline.feed.push(record);
				});
			}else{
				logger.error("facebook timeline results is empty or invalid", result);
			}

			this.resolve(response);
		},

		error: function(err){
			logger.error(err);
			this.reject(response);
		}
	};
	return core;
};

module.exports = function(req){

	return timelineModule(req).getFeed();
};