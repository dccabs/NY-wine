'use strict';

/**
 * @ngdoc function
 * @name nyWineApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the nyWineApp
 */

angular.module('nyWineApp')
  .controller('MobileMapCtrl', function ($scope,$location,$rootScope,$timeout,$http) {

    $rootScope.device = "mobile";
    $scope.bookmarkedVenue = $location.search().venue;

    $http.get('/data/venues.json').
      success(function(data, status, headers, config) {
        $scope.venues = data;
        $scope.regions = [];

	      angular.forEach($scope.venues, function(venue) {
	      	//console.log(venue.region)
	      	if ($scope.regions.indexOf(venue.region)==-1) {
	      		$scope.regions.push(venue.region);
	      	}
	      })
      });
 });

  //end controller
		
