var app = angular.module('app', ['ngResource', 'ngRoute'])

function Config ($routeProvider) {
	$routeProvider
	.when('/game', {
		templateUrl: 'app/game/game.html',
		controller: 'GameCtrl'
	})
	.when('/jobs/:jobId', {
		templateUrl: 'app/jobs/job-detail.html',
		controller: 'JobDetailCtrl'
	})
	.when('/jobs', {
		templateUrl: 'app/jobs/jobs.html',
		controller: 'JobsCtrl'
	})
	.when('/applies', {
		templateUrl: 'app/applies/applies.html',
		controller: 'AppliesCtrl'
	})
	.otherwise('/jobs', {
		templateUrl: 'app/jobs/jobs.html',
		controller: 'JobsCtrl'
	})
}

app.config(Config);