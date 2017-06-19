import React, { Component } from 'react';
import RelatedQueries from '../components/RelatedQueries';
import SearchBar from '../components/SearchBar';
import Graph from '../components/Graph';
import axios from 'axios';
import csvtojson from 'csvtojson';
// import { startDate, endDate } from '../graph/constants';

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
			.then(dataArray => {
				this.setState({
					data: dataArray[0].timelineData,
					financeData: dataArray[1],
					relatedQueries: dataArray[0].relatedQueries
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
		return axios.get('https://www.google.com/finance/historical', {
				params: {
					q: `NASDAQ:${ticker}`,
					startdate: '2010-01-01',
					enddate: '2017-06-17',
					output: 'csv'
				}
			}).then(res => {
				const jsonArr = [];
				csvtojson({noheader:false})
					.fromString(res.data)
					.on('csv', (csvRow) => { // csv => [1, 2, 3] , [4, 5, 6] , etc.
					    // jsonArr.push(csvRow);
					    jsonArr.push({
					    	time: new Date(csvRow[0]).getTime()/1000, // date
					    	value: [csvRow[4]] // close price
					    })
					})
					.on('done', () => {
					    console.log('Done parsing data');
					})
				return jsonArr;
			})
			.catch(err => {
				console.error(err);
			})
	}

	render () {
		return (
			<div className='container-fluid'>
			<h3>Google Search Stock Analyzer</h3>
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