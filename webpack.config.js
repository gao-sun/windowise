const webpack = require('webpack');
const path = require('path');
const dist = path.resolve('./dist/');
const PACKAGE = require('./package.json');

const banner = 
	PACKAGE.name + ' - v' + PACKAGE.version + '\n' +
	'@author ' + PACKAGE.author + '\n' +
	'@license ' + PACKAGE.license + '\n' +
	'@homepage ' + PACKAGE.homepage;

module.exports = {
	context: path.resolve('./src/'),
	entry: {
		'windowise': './js/index',
		'windowise.min': './js/index'
	},
	output: {
		filename: '/[name].js',
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
			}
		]
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			include: /\.min\.js$/,
			minimize: true
		}),
		new webpack.BannerPlugin(banner)
	]
};