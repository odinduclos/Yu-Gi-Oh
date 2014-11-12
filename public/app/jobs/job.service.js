function JobFactory($resource) {
	return $resource('/app/jobs/:jobId', {jobId: '@_id'});;
}
JobFactory.$inject = ['$resource'];
angular.module('app').factory('Jobs', JobFactory);
