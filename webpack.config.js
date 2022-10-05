const webpack = require('webpack');

module.exports = {
  entry: './browser/index.js', // assumes your entry point is the index.js in the root of your project folder
  output: {
    path: __dirname,
    filename: './public/bundle.js' // assumes your bundle.js will also be in the root of your project folder
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: {
          presets: ['react', 'es2015'] // if you aren't using 'babel-preset-es2015', then omit the 'es2015'
        }
      }    ]
  },
  // node: {
  //   fs: 'empty'
  // },
  plugins:[
    new webpack.DefinePlugin({
        process: {env: {}}
    })
  ],
  target: 'web',
  resolve: {
    fallback: {
      "os": require.resolve("os-browserify/browser"),
      "stream": require.resolve("stream-browserify"),
      "util": require.resolve("util/"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "zlib": require.resolve("browserify-zlib"),
      "crypto": require.resolve("crypto-browserify"),
      "assert": require.resolve("assert/"),
      "net": false,
      "tls": false,
      "path": false,
      "fs": false,
    }
  }
};
