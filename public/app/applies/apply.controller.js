function ApplyController ($scope, $routeParams, Jobs) {
	var id = $routeParams.jobId;
	$scope.job = Jobs.get({ jobId: id});
}
JobDetailController.$inject = ['$scope', '$routeParams', 'Jobs'];
angular.module('app').controller('JobDetailCtrl', ApplyController);