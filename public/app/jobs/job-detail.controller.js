function JobDetailController ($scope, $resource, $routeParams, Jobs, Applies) {
	var id = $routeParams.jobId;
	$scope.job = Jobs.get({ jobId: id});
	$scope.applied = false;

	$scope.createApply = function (jobId, apply) {
		apply.job = jobId;
		var apply = new Applies(apply);
		apply.$save().then(function (data) {
			$scope.applied = true;
		});
	}
}

JobDetailController.$inject = ['$scope', '$resource', '$routeParams', 'Jobs', 'Applies'];
angular.module('app').controller('JobDetailCtrl', JobDetailController);