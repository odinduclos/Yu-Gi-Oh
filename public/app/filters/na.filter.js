function NaFilter () {
	return function (input) {
		return input? input: 'N/A';
	}
}
angular.module('app').filter('na', NaFilter);