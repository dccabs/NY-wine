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
    $scope.page = "map";
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

    $scope.closeExpandedRegions = function() {
      angular.forEach($scope.regions,function(region) {
        region.expanded = false;
      })
    }
 }) //end controller
  .directive('scrolling', function() {
    return function(scope, element, attrs) {
      // $(window).scroll(function(e) {
      //   var top = $('body').scrollTop();
      //   console.log(top)
      //   if (top > 95) {
      //     $('.region-image, .filters').addClass("fixed");
      //   } else {
      //     $('.region-image, .filters').removeClass("fixed");
      //   }
      // });

      var touchMove = function() {
        var top = $('body').scrollTop();
        console.log(top)
        if (top > 95) {
          $('.region-image, .filters').addClass("fixed");
        } else {
          $('.region-image, .filters').removeClass("fixed");
        }
      }

      window.addEventListener("scroll", touchMove, false);
    }
  })
  .filter('plusify',function() {
    return function(input) {
        if (input) {
            return input.replace(/\s+/g, '+');
        }
    }
  })
		
