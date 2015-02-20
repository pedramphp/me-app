"use strict";

var Q = require('q');

var logger = require('src/utils').logger;


module.exports = function(req){
	var deferred = Q.defer();

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
		layout: 'main'
	};


	var timeline = require('src/modules/timeline/').friends(req);
	timeline.then(function(result){
		if(result && result.data){
			result.data.forEach(function(post){
				var record = {
					type: 'facebook'
				};
				record.posts = [
					post
				];
				response.data.timeline.feed.push(record);
			});
		}

		deferred.resolve(response);

	}).catch(TypeError, function(e) {
		logger.error(e.stack);
	}).catch(ReferenceError, function(e) {
		logger.error(e.stack);
	}).catch(function(e) {
		logger.error(e.stack);
		deferred.resolve(response);
	});


	return deferred.promise;
};