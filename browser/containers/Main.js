import React, { Component } from 'react';
import RelatedQueries from '../components/RelatedQueries';
import SearchBar from '../components/SearchBar';
import Graph from '../components/Graph';
import axios from 'axios';
import csvtojson from 'csvtojson';
import { startDate, endDate } from '../graph/constants';
import jsonp from 'jsonp';

export default class extends Component {
	constructor () {
		super();
		this.state = {
			keyword: '',
			ticker: '',
			searchRelatedQueries: false,
			relatedQueries: [],
			data: [],
			financeData: []
		};
		this.updateGraph = this.updateGraph.bind(this);
		this.fetchData = this.fetchData.bind(this);
	}

	updateGraph (keyword, ticker, searchRelatedQueries) {
		this.setState({ keyword, ticker, searchRelatedQueries });
		if (keyword && ticker) this.fetchData(keyword, ticker, searchRelatedQueries);
	}

	fetchData (keyword, ticker, searchRelatedQueries) {
		Promise.all([this.getInterestOverTime(keyword, searchRelatedQueries), this.getFinanceData(ticker)])
			.then(res => {
				console.log('do i have an array??', res);
				const data = res[0].timelineData;
				const relatedQueries = res[0].relatedQueries;
				const financeData = res[1];
				this.setState({
					data,
					financeData,
					relatedQueries
				});
			})
			.catch(err => {
				console.error(err);
			});
	}

	getInterestOverTime (keyword, searchRelatedQueries) {
		return axios.get(`/api/fetchData/${keyword}`, {
				params: {
					searchRelatedQueries: searchRelatedQueries
				}
			})
			.then(res => {
				console.log('sadfasdfasdfas', res.data);
				return {
					timelineData: res.data.default.timelineData,
					relatedQueries: res.data.queries
				}
			})
			.catch(err => {
				console.error(err);
			});
	}

	getFinanceData (ticker) {
			return axios.get(`/api/financeData`, {
				params: {
					ticker: ticker,
					startDate: startDate.toISOString().split('T')[0],
					endDate: endDate.toISOString().split('T')[0],
				}
			})
			.then(res => {
				console.log('yo!!!!', res.data);
				return res.data.map(d => {
					console.log(d.date, new Date(d.date), new Date(d.date).getTime(), d.close);
					return ({
						time: new Date(d.date).getTime()/1000,
						value: d.close
					});
				})
			})
			.catch(err => {
				console.error(err);
			});
}

// getFinanceData (ticker) {
	// return googleFinance.historical({
	//   symbol: 'NASDAQ:AAPL',
	//   from: '2014-01-01',
	//   to: '2014-12-31'
	// }, function (err, quotes) {
	//   	console.log(quotes);
	// });
// }

// getFinanceData (ticker) {
//     $.ajax({ 
//     		type: 'GET',
//     		url: `https://www.google.com/finance/historical?q=NASDAQ:${ticker}&output=csv`,
//     		// data: {
//     		// 	q: `NASDAQ:${ticker}`, 
//     		// 	output: 'csv'
//     		// },
//             // jsonpCallback: 'jsonCallback',
//             // contentType: "application/json",
//             crossDomain: true,
//             headers: {
//             	// 'Origin': '127.0.0.1',
//                 'Access-Control-Allow-Origin': '*'
//             },
//             // dataType: 'csv',
//             success: function(json) {
//                // $('#result').html(json[0].name+' - '+json[0].l);
//             },
//             error: function(e) {
//                console.log(e.message);
//             },
//             // beforeSend: setHeader
//            });
// }

// getFinanceData (ticker) {
// 	fetch(`https://www.google.com/finance/historical?q=NASDAQ:${ticker}&output=csv`, {
// 		mode: 'no-cors',
// 		// headers: {
// 		//     "Content-Type": "application/vnd.ms-excel"
// 		//   },
// 	})
// 	.then(data => {
// 		console.log(data);
// 	})
// 	.catch(e => console.error(e.message));
// }

// getFinanceData (ticker) {
// 	return jsonp('https://www.google.com/finance/historical', {
// 		param: `q=NASDAQ:${ticker}&nothing`, name: 'candice'}, (err, res) => {
// 			console.error(err);
// 			console.log(res);
// 			const jsonArr = [];
// 			csvtojson({noheader:false})
// 				.fromString(res.data)
// 				.on('csv', (csvRow) => { // csv => [1, 2, 3] , [4, 5, 6] , etc.
// 				    // jsonArr.push(csvRow);
// 				    jsonArr.push({
// 				    	time: new Date(csvRow[0]).getTime()/1000, // date
// 				    	value: [csvRow[4]] // close price
// 				    })
// 				})
// 				.on('done', () => {
// 				    console.log('Done parsing data');
// 				})
// 			return jsonArr;
// 		});
// }
	// getFinanceData (ticker) {
	// 	console.log('tickaaaaaa');
	// 	return axios.get('https://www.google.com/finance/historical', {
	// 			params: {
	// 				q: `NASDAQ:${ticker}`,
	// 				startdate: '2010-01-01',
	// 				enddate: '2017-06-17',
	// 				output: 'csv'
	// 			},
	// 			headers: {
	// 				'Origin': 'http://google.com/',
	// 				'X-Requested-With': new XMLHttpRequest(),
 //                	'Access-Control-Allow-Origin': '*'
 //            	},
	// 		}).then(res => {
	// 			const jsonArr = [];
	// 			csvtojson({noheader:false})
	// 				.fromString(res.data)
	// 				.on('csv', (csvRow) => { // csv => [1, 2, 3] , [4, 5, 6] , etc.
	// 				    // jsonArr.push(csvRow);
	// 				    jsonArr.push({
	// 				    	time: new Date(csvRow[0]).getTime()/1000, // date
	// 				    	value: [csvRow[4]] // close price
	// 				    })
	// 				})
	// 				.on('done', () => {
	// 				    console.log('Done parsing data');
	// 				})
	// 			return jsonArr;
	// 		})
	// 		.catch(err => {
	// 			console.log('there was an error');
	// 			console.error(err);
	// 		})
	// }

	render () {
		return (
			<div className='container-fluid'>
			<h3>Google Search Query Stock Analyzer</h3>
			<div>
				<SearchBar updateGraph={this.updateGraph} query={this.state.keyword} ticker={this.state.ticker} searchRelatedQueries={this.state.searchRelatedQueries} />
				{this.state.searchRelatedQueries ?
					<RelatedQueries relatedQueries={this.state.relatedQueries} /> : null
				}
				<Graph data={this.state.data} financeData={this.state.financeData} />
			</div>
			</div>
		)
	}
}