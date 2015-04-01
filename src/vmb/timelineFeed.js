'use strict';

module.exports = function( feeds ){
	var viewModel = {};
	var activeFeed;

	viewModel.feeds = [];
	feeds && feeds.forEach(function (feed){
		if(activeFeed && activeFeed.network === feed.network){
			activeFeed.feeds.push(feed.feed);
		}else{
			activeFeed = {
				network: feed.network,
				feeds: [
					feed.feed
				]
			};
			viewModel.feeds.push(activeFeed);
		}
	});

	return viewModel;
};