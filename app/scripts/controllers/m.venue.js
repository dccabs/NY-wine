'use strict';

/**
 * @ngdoc function
 * @name nyWineApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the nyWineApp
 */

angular.module('nyWineApp')
  .controller('MobileVenueCtrl', function ($scope,$location,$rootScope,$timeout,$http) {
    $scope.page = "venue";
    $rootScope.device = "mobile";
    $scope.id = $location.search().id;
    $scope.region = $location.search().r;
    $scope.subRegion = $location.search().sr;

		$http.get('data/venues.json').
      success(function(data, status, headers, config) {
				$scope.venue= _.filter(data, function(venue) {
          return venue.id==$scope.id;
        });
        $scope.venue = $scope.venue[0];

      });

    $scope.backToList = function() {
        $location.path('venues');
    }

 }); //end controller

		
