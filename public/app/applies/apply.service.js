function ApplyFactory($resource) {
	return $resource('/app/applies/:applyId', {applyId: '@_id'});;
}
ApplyFactory.$inject = ['$resource'];
angular.module('app').factory('Applies', ApplyFactory);
