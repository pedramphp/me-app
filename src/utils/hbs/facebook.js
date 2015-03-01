"use strict";
module.exports = function(){
	return {
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
	};
};