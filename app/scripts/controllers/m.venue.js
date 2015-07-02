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

    $rootScope.device = "mobile";
    $scope.venueName = $location.search().name;

		$http.get('/data/venues.json').
      success(function(data, status, headers, config) {
				$scope.venue= _.filter(data, function(venue) {
          return venue.name==$scope.venueName;
        });
        $scope.venue = $scope.venue[0];
        console.log($scope.venue+ "aa")
      });

    // $scope.selectRegion = function(region) {
    //   console.log(region);
    //   sharedProperties.setRegion(region);
    //   $location.path('/region');
    // }

 }); //end controller

		
