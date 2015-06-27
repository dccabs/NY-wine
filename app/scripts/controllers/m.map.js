'use strict';

/**
 * @ngdoc function
 * @name nyWineApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the nyWineApp
 */

angular.module('nyWineApp')
  .controller('MobileMapCtrl', function ($scope,$location,$rootScope,$timeout,$http,sharedProperties) {

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

    $scope.selectRegion = function(region) {
      console.log(region);
      sharedProperties.setRegion(region);
      $location.path('/region');
    }


 })

  //end controller

  .service('sharedProperties', function() {
    var objValue = [];
    return {
      setRegion: function(region) {
        objValue = region;
      },
      getRegion: function() {
        return objValue;
      }
    }
});

  // end sharedProperties
		
