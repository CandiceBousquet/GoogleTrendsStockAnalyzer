const path = require('path');
const express = require('express');
const app = express();
const cors_proxy = require('cors-anywhere');

const PORT = 8080;

app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/api', require('./api'));

app.use('/', (req, res, next) => {
	res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(PORT, () => {
	console.log(`server listening on port ${PORT}`);
});

console.log('adfasf');

// const HOST = process.env.HOST || '0.0.0.0';
// const proxy = 8888;
// cors_proxy.createServer({
//     originWhitelist: [], // Allow all origins
//     // requireHeader: ['origin', 'x-requested-with'],
//     requireHeader: ['origin', 'x-requested-with'],
//     // removeHeaders: ['cookie', 'cookie2']
// }).listen(proxy, HOST, function() {
//     console.log('Running CORS Anywhere on ' + HOST + ':' + proxy);
// });