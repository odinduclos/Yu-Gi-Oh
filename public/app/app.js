var app = angular
	.module('app', ['ngResource', 'ngRoute'])
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
  	});

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