'use strict';

/* Controllers */

angular.module('app')
    .controller('HomeCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Main', function($rootScope, $scope, $location, $localStorage, Main) {

        $scope.signin = function() {
            var formData = {
                email: $scope.email,
                password: $scope.password
            }

            Main.signin(formData, function(res) {
                $localStorage.token = res.data.token;

                $location.path('/me');
            }, function() {
                $rootScope.error = 'Failed to signin';
            })
        };

        $scope.signup = function() {
            var formData = {
                email: $scope.email,
                password: $scope.password
            }

            Main.save(formData, function(res) {
                $localStorage.token = res.data.token;
$("#signin").hide();
$("#signup").hide();
$("#me").show();
$("#play").show();
$("#logout").show();
                $location.path('/me');
            }, function() {
                $rootScope.error = 'Failed to signup';
            })
        };

        $scope.me = function() {
            Main.me(function(res) {
$("#signin").hide();
$("#signup").hide();
$("#me").show();
$("#play").show();
$("#logout").show();
                $scope.myDetails = res;
            }, function() {
                $rootScope.error = 'Failed to fetch details';
            })
        };

        $scope.logout = function() {
            Main.logout(function() {
$("#signin").show();
$("#signup").show();
$("#me").hide();
$("#play").hide();
$("#logout").hide();
                $location.path('/');
            }, function() {
                $rootScope.error = 'Failed to logout';
            });
        };
		$scope.token = $localStorage.token;
    }])

.controller('MeCtrl', ['$rootScope', '$scope', '$location', 'Main', function($rootScope, $scope, $location, Main) {

        Main.me(function(res) {
            $scope.myDetails = res;
        }, function() {
            $rootScope.error = 'Failed to fetch details';
        })
}]);
