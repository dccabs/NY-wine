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

		$scope.wineries = null;
    $scope.hotels = null;
    $scope.restaurants = null;
    $scope.hideWineries = false;
    $scope.hideHotels = false;
    $scope.hideAttractions = false;
    $scope.hideRestaurants = false;

    $rootScope.device = "desktop";
    $scope.bookmarkedVenue = $location.search().venue;

    $http.get('/data/venues.json').
      success(function(data, status, headers, config) {
        $scope.venues = data;
        $scope.attractions = _.filter($scope.venues, function(venue) {
          return venue.type=="Attraction";
        });
        $scope.hotels = _.filter($scope.venues, function(venue) {
          return venue.type=="Hotel";
        });
        $scope.restaurants = _.filter($scope.venues, function(venue) {
          return venue.type=="Restaurant";
        });
        $scope.wineries = _.filter($scope.venues, function(venue) {
          return venue.type=="Winery";
        });

        $scope.regions = [];

	      angular.forEach($scope.venues, function(venue) {
	      	//console.log(venue.region)
	      	if ($scope.regions.indexOf(venue.region)==-1) {
	      		$scope.regions.push(venue.region);
	      	}
	      })
      });



 }); //end controller

		
