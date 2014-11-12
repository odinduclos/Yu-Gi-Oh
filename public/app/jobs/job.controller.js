function JobsController ($scope, $resource, Jobs) {
	$scope.jobs = Jobs.query();
}
JobsController.$inject = ['$scope', '$resource', 'Jobs'];
angular.module('app').controller('JobsCtrl', JobsController);