const webpack = require('webpack');
const path = require('path');
const src = path.resolve('./src/');
const dist = path.resolve('./dist/');

module.exports = {
	watch: true,
	devtool: 'source-map',
	context: src,
	entry: {
		'windowise': './js/index',
		'windowise.min': './js/index',
	},
	resolve: {
		alias: {
			svg: path.resolve('./src/svg/')
		}
	},
	output: {
		filename: '[name].js',
		path: dist,
		library: ['Windowise'],
		libraryTarget: 'umd'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [ 
					{
						loader: 'babel-loader',
						query: {
							presets: [ 'es2015' ]
						}
					}
				]
			},
			{
				test: /\.svg$/,
				exclude: /node_modules/,
				use: 'raw-loader'
			}
		]
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			include: /\.min\.js$/,
			minimize: true
		})
	]
};