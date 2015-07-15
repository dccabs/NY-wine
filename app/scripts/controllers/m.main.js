'use strict';

/**
 * @ngdoc function
 * @name nyWineApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the nyWineApp
 */

angular.module('nyWineApp')
  .controller('MobileMainCtrl', function ($scope,$location,$rootScope,$timeout,$http) {
    $rootScope.device = "mobile";
    $scope.page = "intro";

 }); //end controller

		
