(function (angular) {
	'use strict';

	function starterController($scope, $state, alertService) {
		_.set(this, 'startPage', '/angular_starter1x.tpl.html');
		_.set($scope, 'animationsEnabled', true);

		$scope.initialise = function() {
			_.set($scope, 'alertService', alertService);
			_.set($scope, 'isCollapsed', true);
			_.set($scope, 'go', function(state) {
				$state.go(state);
			});
		};

		$scope.initialise();
	}
	starterController.$inject = ['$scope','$state', 'alertService'];

	angular
		.module('angular_starter1x', [
			'angular_starter1x.templates',
			'angular_starter1x.alertService',
			'states',
			'ui.bootstrap',
			'ngAnimate',
			'ngSanitize'
		])
		.config(['$qProvider', function ($qProvider) {
			$qProvider.errorOnUnhandledRejections(false);
		}])
		.controller('starterController', starterController)
	;
}(angular));
