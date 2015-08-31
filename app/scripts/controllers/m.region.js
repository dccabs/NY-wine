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
    $scope.page = "region";
    $rootScope.device = "mobile";
    $scope.r = $location.search().r;
    $scope.region = $scope.r.split("-").join(" ");

		$http.get('data/regions.json').
      success(function(data, status, headers, config) {
				$scope.selectedRegion = _.filter(data, function(region) {
          return region.name.toLowerCase()==$scope.region;
        });

				$scope.subRegions = $scope.selectedRegion[0].sub_regions;
      });

    $scope.getUrlName = function(name) {
      var urlName = name.split(" ").join("-");
      urlName = urlName.split("&").join("and");
      urlName = urlName.toLowerCase();
      return urlName;
    }

 }); //end controller

		
