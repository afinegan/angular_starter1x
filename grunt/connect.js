'use strict';

var assign = require('lodash/assign');
var bodyParser = require('body-parser');
var forEach = require('lodash/forEach');
var get = require('lodash/get');
var isFunction = require('lodash/isFunction');
var proxyMiddleware = require('http-proxy-middleware');
var resolve = require('path').resolve;
var rewriteMiddleware = require('http-rewrite-middleware').getMiddleware;

// eslint-disable-next-line import/no-dynamic-require
var pkg = require(resolve('package'));

var dropResponseCookies = require('./scripts/middleware/dropResponseCookies');
var nodeModuleMiddleware = require('./scripts/middleware/nodeModules');
var serveMockApiMiddleware = require('./scripts/middleware/serveMockApi');

module.exports = function configureConnect(grunt) {
	function configureMiddleware(connect, options, defaultMiddleware) {
		var rewritePaths = get(options, 'rewritePaths', []);
		var proxies = get(options, 'proxies', []);
		var debug = grunt.option('debug');
		var middleware = [];

		middleware.push(
			rewriteMiddleware(rewritePaths, { verbose: debug }),
			nodeModuleMiddleware,
			dropResponseCookies
		);

		if (get(pkg, 'config.mockApi', false) || grunt.option('mock-api')) {
			middleware.push(serveMockApiMiddleware);
		}

		forEach(proxies, function (proxy) {
			var proxyConfig = isFunction(proxy) ? proxy(grunt) : proxy;

			middleware.push(
				proxyMiddleware(
					proxyConfig.context,
					assign(proxyConfig.options, {
						logLevel: debug ? 'debug' : 'info'
					})
				)
			);
		});
		return middleware.concat(defaultMiddleware);
	}

	// Connect task config
	return {
		server: {
			options: {
				base: '<%= dest %>',
				hostname: '*',
				livereload: true,
				middleware: configureMiddleware,
				open: grunt.option('open') === true,
				port: 8000,
				rewritePaths: [
					{ from: '^/libs/<%= package.name %>/(?:[\\d\\.]+|latest)/(.*?)$', to: '/$1' },
					{ from: '^/libs/(.*?)/(?:[\\d\\.]+|latest)/(.*?)$', to: '/node_modules/$1/dist/$2' },
					{ from: '^/(.*?)/websvc', to: '/$1/api' }
				],
				useAvailablePort: true
			}
		},
		coverage: {
			options: {
				base: ['<%= grunt.file.expand("coverage/PhantomJS*")[0] || "coverage"%>'],
				hostname: '*',
				livereload: true,
				open: grunt.option('open') === true,
				port: 8001,
				useAvailablePort: true
			}
		}
	};
};
