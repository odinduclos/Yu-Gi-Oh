function AppliesController ($scope, $resource, Applies) {
	$scope.applies = Applies.query();
}
AppliesController.$inject = ['$scope', '$resource', 'Applies'];
angular.module('app').controller('AppliesCtrl', AppliesController);