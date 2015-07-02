'use strict';

/**
 * @ngdoc function
 * @name nyWineApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the nyWineApp
 */

angular.module('nyWineApp')
  .controller('MobileVenuesCtrl', function ($scope,$location,$rootScope,$timeout,$http) {

    $rootScope.device = "mobile";
    $scope.subRegion = $location.search().sr;
    $scope.region = $location.search().r;

    if ($scope.subRegion) {
      $http.get('/data/venues.json').
      success(function(data, status, headers, config) {
        $scope.venues = _.filter(data, function(venue) {
          return venue.sub_region==$scope.subRegion;
        });
      });

    } else {
      $http.get('/data/venues.json').
      success(function(data, status, headers, config) {
        $scope.venues = _.filter(data, function(venue) {
          return venue.region==$scope.region;
        });
      });
    }

 }); //end controller

		
