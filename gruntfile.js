'use strict';

var forEach = require('lodash/forEach');
var getDependencyVersions = require('./grunt/scripts/dependencyVersions.js');
var glob = require('glob');
var gruntTemplateProgeny = require('grunt-template-progeny');
var gruntTemplateRename = require('grunt-template-rename');
var includes = require('lodash/includes');
var loadGruntConfig = require('load-grunt-config');
var merge = require('lodash/merge');
var path = require('path');
var reduce = require('lodash/reduce');
var set = require('lodash/set');
var timeGrunt = require('time-grunt');

function generateStaticMappings(dirs) {
    return reduce(dirs, function (result, dir) {
        var files = glob.sync(path.join(dir, 'grunt/tasks/*.js'));
        forEach(files, function (file) {
            var ext = path.extname(file);
            var base = path.basename(file, ext);
            result[base] = file; // eslint-disable-line no-param-reassign
        });
        return result;
    }, {});
}

module.exports = function (grunt, options) {
    if (grunt.option('time') === true) { timeGrunt(grunt); }

    var projectPath = process.cwd();
    var gruntPluginPath = require.resolve('grunt-contrib-clean');

    var defaults = {
        configPath: path.join(projectPath, 'grunt'),
        overridePath: path.join(projectPath, 'grunt'),
        data: {
            BUILD_NUMBER: process.env.BUILD_NUMBER || 'Development',
            GIT_COMMIT: process.env.GIT_COMMIT || 'Development',
            appFileName: '<%= package.name %>',
            banner: grunt.file.read(path.join(projectPath, 'grunt/banner.txt')),
            dest: 'dist',
            demoDest: 'demo',
            process: grunt.template.process,
            src: '<%= "app" %>',
            demoSrc: 'src.demo',
            temp: '.temp',
            testEnvYAML: '<%= src %>/test-env.yml',
            useMin: grunt.option('min') || includes(grunt.cli.tasks, 'build'),
            vendorYAML: '<%= src + "/vendor.js.yml" %>',
            vendorLocales: '<%= src %>/locales.yml',
            versions: getDependencyVersions
        },
        jitGrunt: {
            pluginsRoot: 'node_modules',
            staticMappings: merge(
            {
                configureProxies: 'grunt-connect-proxy',
                force: 'grunt-force-task',
                ngtemplates: 'grunt-angular-templates'
            },
            generateStaticMappings([projectPath])
            )
        }
    };

    // Apply grunt template helpers
    gruntTemplateProgeny(grunt);
    gruntTemplateRename(grunt);
    set(grunt, 'template.path', path);

    loadGruntConfig(grunt, merge({}, defaults, options));
};
