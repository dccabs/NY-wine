'use strict';

/**
 * @ngdoc function
 * @name nyWineApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the nyWineApp
 */

angular.module('nyWineApp')
  .controller('MobileRegionCtrl', function ($scope,$location,$rootScope,$timeout,$http) {

    $rootScope.device = "mobile";
    $scope.region = $location.search().r;

		$http.get('/data/venues.json').
      success(function(data, status, headers, config) {
				$scope.venues = _.filter(data, function(venue) {
          return venue.region==$scope.region;
        });

				$scope.subRegions = [];
				angular.forEach($scope.venues, function(venue) {
	      	//console.log(venue.region)
	      	if ($scope.subRegions.indexOf(venue.sub_region)==-1) {
	      		$scope.subRegions.push(venue.sub_region);
	      	}
	      })

      });

    $scope.selectRegion = function(region) {
      console.log(region);
      sharedProperties.setRegion(region);
      $location.path('/region');
    }

 }); //end controller

		
