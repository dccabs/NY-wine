'use strict';

/**
 * @ngdoc function
 * @name nyWineApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the nyWineApp
 */
angular.module('nyWineApp')
  .controller('MapCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.regions = {
      longIsland: { position: [40.868282, -72.842895]},
      fingerLakes: { position: [42.727274, -76.836426]},
      lakeErie: { position: [42.419645, -79.436646]},
      niagraEscarpment: { position: [43.168962, -79.005821]},
      hudsonRiver: { position: [41.630632, -73.959698]}
    };

    $scope.getRadius = function(num) {
      return Math.sqrt(num) * 100;
    };

    $scope.mapZoom = 7;

    $scope.mapCoordinates = [42.7534979, -75.8092041];

    $scope.regionClick = function() {
      console.log(this.center);
      $scope.mapCoordinates = [this.center.A, this.center.F];
      $scope.mapZoom = 10;
    };
  });
