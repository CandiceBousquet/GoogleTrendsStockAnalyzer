const googleTrends = require('google-trends-api');
const { startDate, endDate } = require('../../../browser/graph/constants');

function getInterestOverTime (keyword) {
	return googleTrends.interestOverTime({
			keyword: keyword,
			startTime: startDate,
			endTime: endDate
		})
		.then((res) => {
		  return JSON.parse(res);
		})
		.catch((err) => {
		  throw err;
		});
}

function getRelatedQueries (keyword) {
	return googleTrends.relatedQueries({
		keyword: keyword,
		startTime: startDate,
		endTime: endDate
	})
	.then((res) => {
	  return JSON.parse(res);
	})
	.catch((err) => {
	  throw err;
	});
}

module.exports = { 
	getInterestOverTime,
	getRelatedQueries
};