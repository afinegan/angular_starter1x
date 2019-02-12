'use strict';

var path = require('path');

module.exports = {
	options: {
		htmlmin: {
			collapseBooleanAttributes: true,
			collapseWhitespace: true,
			conservativeCollapse: true,
			removeAttributeQuotes: true,
			removeComments: true,
			removeEmptyAttributes: true,
			removeRedundantAttributes: true,
			removeScriptTypeAttributes: true,
			removeStyleLinkTypeAttributes: true
		}
	},
	app: {
		options: {
			base: '<%= src %>',
			module: '<%= package.name %>.templates',
			prefix: '/apps/<%= package.name %>/',
			quotes: 'single',
			singleModule: true,
			standalone: true,
			url: function pathFix(templatePath, options) {
				return path.relative(options.base, templatePath);
			},
			useStrict: true
		},
		src: '<%= src %>/**/*.tpl.html',
		dest: '<%= temp %>/<%= appFileName %>.tpl.js'
	},
};
