var app = angular
	.module('app', ['ngResource', 'ngRoute', 'ngStorage'])
	.directive('draggable', ['$document' , function($document) {
		return {
			restrict: 'A',
			link: function(scope, elm, attrs) {
				var startX, startY, initialMouseX, initialMouseY;

				elm.bind('mousedown', function($event) {
					startX = elm.prop('offsetLeft');
					startY = elm.prop('offsetTop');
					initialMouseX = $event.clientX;
					initialMouseY = $event.clientY;
					$document.bind('mousemove', mousemove);
					$document.bind('mouseup', mouseup);
					return false;
				});

				function mousemove($event) {
					if ($event.clientX != initialMouseX || $event.clientY != initialMouseY) {
						elm.css({position: 'absolute'});
					}
					var dx = $event.clientX - initialMouseX;
					var dy = $event.clientY - initialMouseY;
					elm.css({
						top:  startY + dy + 'px',
						left: startX + dx + 'px'
					});
					return false;
				}

				function mouseup() {
					$document.unbind('mousemove', mousemove);
					$document.unbind('mouseup', mouseup);
				}
			}
		};
	}])
	.filter('reverse', function() {
  		return function(items) {
    		return items.slice().reverse();
  		};
  	})
	.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
	$routeProvider.
	when('/', {
		templateUrl: 'app/partials/home.html',
		controller: 'HomeCtrl'
	}).
	when('/signin', {
		templateUrl: 'app/partials/signin.html',
		controller: 'HomeCtrl'
	}).
	when('/signup', {
		templateUrl: 'app/partials/signup.html',
		controller: 'HomeCtrl'
	}).
	when('/me', {
		templateUrl: 'app/partials/me.html',
		controller: 'HomeCtrl'
	})
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
	.otherwise('/', {
            redirectTo: '/'
	});
	
	    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    if ($localStorage.token) {
                        config.headers.Authorization = 'Bearer ' + $localStorage.token;
                    }
                    return config;
                },
                'responseError': function(response) {
                    if(response.status === 401 || response.status === 403) {
                        $location.path('/signin');
                    }
                    return $q.reject(response);
                }
            };
        }]);
	}
]);