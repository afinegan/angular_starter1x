(function (angular) {
	'use strict';

	function configureStates($urlRouterProvider, $locationProvider) {
		$urlRouterProvider.otherwise('/');
		$locationProvider.hashPrefix('');
		$locationProvider.html5Mode(false);
	}
	configureStates.$inject = [
		'$urlRouterProvider',
		'$locationProvider'
	];

	angular.module('states', [
		'ui.router',
		'state.index'
	])
		.config(configureStates)
		.run(['$rootScope', '$state', '$stateParams',
			function ($rootScope, $state, $stateParams) {
				_.set($rootScope, '$state', $state);
				_.set($rootScope, '$stateParams', $stateParams);
			}
		])
}(angular));
