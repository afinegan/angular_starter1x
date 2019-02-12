'use strict';

var replace = require('lodash/replace');
var serveStatic = require('serve-static');
var set = require('lodash/set');
var startsWith = require('lodash/startsWith');

var serveNodeModules = serveStatic('node_modules', { index: false });

module.exports = function nodeModuleMiddleware(req, res, next) {
	if (startsWith(req.url, '/node_modules/')) {
		set(req, 'originalUrl', req.url);
		set(req, 'url', replace(req.url, '/node_modules/', '/'));
		serveNodeModules(req, res, next);
	} else {
		next();
	}
};
