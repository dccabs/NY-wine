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

    $scope.markers = [];
    $scope.mapZoom = 7;
    $scope.mapCoordinates = [42.7534979, -75.8092041];

    $scope.regions = {
      longIsland: {
        position: [40.868282, -72.842895],
        venues: [
          { name: 'Whisper Vineyards', pos: {lat:40.870819, lng:-73.179245} },
          { name: 'Loughlin Vineyard', pos: {lat:40.735756, lng:-73.0734} }
        ]
      },
      fingerLakes: { position: [42.727274, -76.836426]},
      lakeErie: { position: [42.419645, -79.436646]},
      niagraEscarpment: { position: [43.168962, -79.005821]},
      hudsonRiver: { position: [41.630632, -73.959698]}
    };

    $scope.getRadius = function(num) {
      return Math.sqrt(num) * 100;
    };

    $scope.getMapZoomLevel = function() {
      return $scope.map.getZoom();
    };

    $scope.isMarkerInMapBounds = function(marker) {
      return $scope.map.getBounds().contains(marker.getPosition());
    };

    $scope.onMapInit = function(event, map) {
      $scope.google.maps.event.addListener(map, 'zoom_changed', $scope.onMapZoomChange);
      $scope.google.maps.event.addListener(map, 'center_changed', $scope.onMapCenterChange);
      console.log('mapInitialized!');

    };

    $scope.onMapCenterChange = function() {
      console.log('center_changed');
    };

    $scope.onMapZoomChange = function() {
      if ($scope.getMapZoomLevel() >= 10) {
        angular.forEach($scope.regions, $scope.setMarkers);
      }
    };

    $scope.onMarkerClick = function() {
      $('#map-overlay')
        .addClass('is-visible')
        .find('.title')
        .html(this.title);
    };

    $scope.onOverlayCloseBtnClick = function() {
      $('#map-overlay')
        .removeClass('is-visible')
        .find('.title')
        .html('');
    };

    $scope.setMarker = function(venue) {
      var position = new $scope.google.maps.LatLng(venue.pos.lat,venue.pos.lng);
      var marker = new $scope.google.maps.Marker({
        position: position,
        map: $scope.map,
        title: venue.name
      });
      $scope.google.maps.event.addListener(marker, 'click', $scope.onMarkerClick);
      $scope.markers.push(marker);
    };

    $scope.setMarkers = function(region) {
      angular.forEach(region.venues, function(venue) {
        console.log(venue.pos);
        $scope.setMarker(venue);
      });
    };

    $scope.regionClick = function() {
      $scope.mapZoom = 10;
      $scope.mapCoordinates = [this.center.A, this.center.F];
    };

    $scope.$on('mapInitialized', $scope.onMapInit);

  });
