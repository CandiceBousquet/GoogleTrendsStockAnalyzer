import * as d3 from 'd3';

// const populateGoogleTrendsData = (nodes, canvas, scales) => {
// 	canvas.selectAll('circle .nodes')
// 	     .data(nodes)
// 	     .enter()
// 	     .append('svg:circle')
// 	     .attr('class', 'nodes')
// 	     .attr('cx', function(d) { return scales.xScale(new Date(d.time*1000)); })
// 	     .attr('cy', function(d) { return d.value[0]; })
// 	     .attr('r', '10px')
// 	     .attr('fill', 'pink');

// 	const links = [];

// 	for (let i=0;i<nodes.length-1;i++){
// 		const linkObj = { source: nodes[i], target: nodes[i+1] }
// 		links.push(linkObj);
// 	}

// 	canvas.selectAll('.line')
// 	   .data(links)
// 	   .enter()
// 	   .append('line')
// 	   .attr('x1', function(d) { return scales.xScale(new Date(d.source.time*1000)); })
// 	   .attr('y1', function(d) { return d.source.value[0] })
// 	   .attr('x2', function(d) { return scales.xScale(new Date(d.target.time*1000)); })
// 	   .attr('y2', function(d) { return d.target.value[0] })
// 	   .style('stroke', 'rgb(6,120,155)');
// }

const constructAxes = (canvas, xScale, yScaleLeft, yScaleRight, height, width, padding) => {
	const xAxis = d3.axisBottom()
		.scale(xScale);

	const yAxisLeft = d3.axisLeft()
		.scale(yScaleLeft);

	const yAxisRight = d3.axisRight()
		.scale(yScaleRight)
		.ticks(5);

	canvas.append('g')
		.attr('class', 'x axis')
		.attr('transform', `translate(0,${height-padding})`)
		.call(xAxis);

	canvas.append('g')
		.attr('class', 'y axis')
		.attr('transform', `translate(${padding}, 0)`)
		.call(yAxisLeft)
		.append('text')
		.text('Interest');

	canvas.append('g')
		.attr('class', 'y axis')
		.attr('transform', `translate(${width-padding}, 0)`)
		.call(yAxisRight);
}

const populateGoogleTrendsData = (nodes, canvas, xScale, yScale) => {
	const area = d3.area()
		.x(function(d) { return xScale(new Date(d.time*1000)); })
		.y0(370)
		.y1(function(d) { return yScale(+d.value[0]); });

	canvas.append('path')
		.datum(nodes)
		.attr('class', 'area')
		.attr('d', area);
}

const populateFinanceData = (nodes, canvas, xScale, yScale) => {
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
	   .attr('y1', function(d) { return yScale(+d.source.value[0]) })
	   .attr('x2', function(d) { return xScale(new Date(d.target.time*1000)); })
	   .attr('y2', function(d) { return yScale(+d.target.value[0]) })
	   .style('stroke', 'rgb(0,128,0)');
}

module.exports = {
	constructAxes,
	populateGoogleTrendsData,
	populateFinanceData
}