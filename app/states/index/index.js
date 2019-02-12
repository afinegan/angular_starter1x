(function (angular) {
	'use strict';

	function configFunction($stateProvider) {
		$stateProvider
			.state('index', {
				templateUrl: '/apps/angular_starter1x/states/index/index.tpl.html',
				url: '/'
			})
		;
	}

	angular
		.module('state.index', [
			'ui.router'
		])
		.config(['$stateProvider', '$urlRouterProvider', configFunction])
	;
}(angular));
