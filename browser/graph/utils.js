import * as d3 from 'd3';
import { height, width, padding, startDate, endDate } from './constants';


let yScaleLeft, yScaleRight;

const xScale = d3.scaleTime()
		.domain([startDate, endDate])
		.range([padding, width - padding]);

const yScale = (data) => {
	return d3.scaleLinear()
		.domain(d3.extent(data, function(d) { return +d.value[0] }))
		.range([height - padding, padding]);
}

// const yScale = (data) => {
// 	// data.forEach(elem => {
// 	// 	console.log(elem.formattedTime, elem.formattedValue, elem.value.reduce((sum, elem) => sum+=+elem, 0))
// 	// })
// 	return d3.scaleLinear()
// 		.domain(d3.extent(data, function(d) { return d.value.reduce((sum, elem) => sum+=+elem, 0) }))
// 		.range([height - padding, padding]);
// }

const constructAxes = (canvas, trendsData, financeData) => {
	const xAxis = d3.axisBottom()
		.scale(xScale);

	yScaleLeft = yScale(trendsData);
	yScaleRight = yScale(financeData);

	canvas.append('g')
		.attr('class', 'x axis')
		.attr('transform', `translate(0,${height-padding})`)
		.call(xAxis);

	canvas.append('g')
		.attr('class', 'y axis')
		.attr('transform', `translate(${padding}, 0)`)
		.call(d3.axisLeft()
			.scale(yScaleLeft)
		);

	canvas.append('g')
		.attr('class', 'y axis')
		.attr('transform', `translate(${width-padding}, 0)`)
		.call(d3.axisRight()
			.scale(yScaleRight)
		);
}

const populateGoogleTrendsData = (nodes, canvas) => {
	const area = d3.area()
		.x(function(d) { return xScale(new Date(d.time*1000)); })
		.y0(height-padding)
		.y1(function(d) { return yScaleLeft(+d.value[0]); });

	canvas.append('path')
		.datum(nodes)
		.attr('class', 'area')
		.attr('d', area);
}

// const populateGoogleTrendsData = (nodes, canvas) => {
// 	// for each node value --> y0 is the previous vlue // y1 is the new value
// 	// start y0 at height-padding

// 	// let y0 = () => height-padding;
// 	let y0 = height-padding;
// 	let y1 = function(d) { return yScaleLeft(+d.value[0]); }
// 	nodes[0].value.forEach((searchItem, index) => {
// 		if (index > 0) {
// 			console.log(index);

// 			y0 = (d) => {
// 				let acc = 0;
// 				for (let i=index;i>=0;i--) {
// 					acc += +d.value[i];
// 				}
// 				console.log(acc, yScaleLeft(acc), (height-padding) - yScaleLeft(acc));
// 				return  (height-padding) - yScaleLeft(acc);
// 			};

// 			y1 = (d) => {
// 				let acc = 0;
// 				for (let i=index;i>=0;i--) {
// 					acc += +d.value[i];
// 				}
// 				return  yScaleLeft(acc);
// 			};
// 			// (d) => yScaleLeft(+d.value[0]) + height-padding
// 			// (d) => yScaleLeft(+d.value[1] + yScaleLeft(+d.value[0]) + height-padding)
// 		}
// 		// console.log(y0);
// 		const area = d3.area()
// 			.x(function(d) { return xScale(new Date(d.time*1000)); })
// 			.y0(y0)
// 			.y1(y1);
// 		// console.log(area);
// 		canvas.append('path')
// 			.datum(nodes)
// 			.attr('class', `area-${index}`)
// 			.attr('d', area);
// 	})
// 		// 	const area = d3.area()
// 		// 	.x(function(d) { return xScale(new Date(d.time*1000)); })
// 		// 	.y0(height-padding)
// 		// 	.y1(function(d) { return yScaleLeft(+d.value[index]); });
// 		// console.log(area);
// 		// canvas.append('path')
// 		// 	.datum(nodes)
// 		// 	.attr('class', `area-${index}`)
// 		// 	.attr('d', area);
// }

const populateFinanceData = (nodes, canvas) => {
	const links = [];

	for (let i=0;i<nodes.length-1;i++){
		const linkObj = { source: nodes[i], target: nodes[i+1] }
		links.push(linkObj);
	}

	canvas.selectAll('.line')
	   .data(links)
	   .enter()
	   .append('line')
	   .attr('x1', function(d) { return xScale(new Date(d.source.time*1000)); })
	   .attr('y1', function(d) { return yScaleRight(+d.source.value[0]) })
	   .attr('x2', function(d) { return xScale(new Date(d.target.time*1000)); })
	   .attr('y2', function(d) { return yScaleRight(+d.target.value[0]) })
	   .style('stroke', 'rgb(0,128,0)');
}

const constructGraph = (node, trendsData, financeData) => {
	const canvas = d3.select(node);
	canvas.attr('width', width)
		.attr('height', height);
	constructAxes(canvas, trendsData, financeData);
	
	if (trendsData.length > 0 && financeData.length > 0) {
		populateGoogleTrendsData(trendsData, canvas);
		populateFinanceData(financeData, canvas);
	}
}

module.exports = constructGraph;
