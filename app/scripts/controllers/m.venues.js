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
    $scope.sr = $location.search().sr;
    $scope.r = $location.search().r;

    if ($scope.r) $scope.region = $scope.r.split("-").join(" ");
    if ($scope.sr) $scope.subRegion = $scope.sr.split("-").join(" ")


    if ($scope.subRegion) {
      $http.get('/data/venues.json').
      success(function(data, status, headers, config) {
        $scope.venues = _.filter(data, function(venue) {
          var sub = venue.sub_region;
          if (sub) sub = venue.sub_region.toLowerCase();
          return sub==$scope.subRegion;
        });
      });

    } else {
      $http.get('/data/venues.json').
      success(function(data, status, headers, config) {
        $scope.venues = _.filter(data, function(venue) {
          return venue.region.toLowerCase()==$scope.region;
        });
      });
    }

    $scope.getUrlName = function(name) {
      var urlName = name.split(" ").join("-");
      urlName = urlName.toLowerCase();
      return urlName;
    }

 }); //end controller

		
