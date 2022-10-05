const trends = require('./data/trends');
const router = require('express').Router();
const googleFinance = require('google-finance');

router.get('/fetchData/:keyword', (req, res, next) => {
	const queryArr = [req.params.keyword];
	const ticker = req.params.ticker;
	const searchRelatedQueries = req.query.searchRelatedQueries;
	console.log("RELATED SEARCH QUERY", searchRelatedQueries);
	if (searchRelatedQueries === 'true') {
		trends.getRelatedQueries(req.params.keyword)
			.then(queries => {
				queries.default.rankedList[0].rankedKeyword.forEach(query => {
					if (query.value > 50 && queryArr.length < 5) {
						queryArr.push(query.query);
					}
				})
				return queryArr;
			})
			.then(queries => {
				getInterestOverTime(queries, res)
			})
			.catch(next);
	} else {
		getInterestOverTime(queryArr, res);
	}
});

router.get('/financeData', (req, res, next) => {
	const {ticker, startDate, endDate} = req.query;
	console.log('in here!!!', ticker, startDate, endDate);
	getFinanceData(ticker, startDate, endDate, res);
});

function getInterestOverTime (queryArr, res) {
	trends.getInterestOverTime(queryArr)
		.then(data => {
			data.queries = queryArr.slice(1, queryArr.length);
			res.json(data);
		})
		.catch((err) => {
			res.status(500).send(err.message);
		});
}

function getFinanceData(ticker, startDate, endDate, res) {
	googleFinance.historical({
	  symbol: ticker.toUpperCase(),
	  from: '2019-01-01',
	  to: '2022-10-03'
	}, function (err, quotes) {
	  	console.log(quotes);
	  	// [
		  // {
		  //   date: 2022-09-30T00:00:00.000Z,
		  //   open: 14.23,
		  //   high: 16.049999,
		  //   low: 14.23,
		  //   close: 15.67,
		  //   adjClose: '15.670000',
		  //   volume: 2780200,
		  //   symbol: 'AAPL:NASDAQ'
		  // }, ...]
	  	res.json(quotes);
	});
}

module.exports = router;