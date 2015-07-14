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

    $http.get('/data/regions.json').
      success(function(data, status, headers, config) {
        $scope.regions = data;
      });

    $scope.getUrlName = function(name) {
    	var urlName = name.split(" ").join("-");
    	urlName = urlName.toLowerCase();
    	return urlName;
    }

    $scope.getClass = function(val) {
      val = val.toLowerCase().split(" ").join("-");
      return val;
    }
 });

  //end controller
		
