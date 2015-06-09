'use strict';

/**
 * @ngdoc function
 * @name nyWineApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the nyWineApp
 */

angular.module('nyWineApp')
  .controller('MapCtrl', function ($scope,$location) {

    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.bookmarkedVenue = $location.search().venue;

    $scope.$watch('bookmarkedVenue', function() {
      var match = _.filter($scope.venues, function(ven){ return ven.name==$scope.bookmarkedVenue; });
      if (!match.length) return;

      match = match[0];
      $scope.mapZoom = 10;
      $scope.mapCoordinates = [match.pos.lat, match.pos.lng];
      $scope.activeVenue = match;
      $scope.showMapOverlay = true;
    });

    $scope.changeLoc = function() {
      $location.search().venue = 'Whisper Vineyards'
    }

    $scope.markers = [];
    $scope.mapZoom = 7;
    $scope.mapCoordinates = [42.7534979, -75.8092041];
    $scope.showMapOverlay = false;
    $scope.activeVenue = null;

    $scope.regions = {
      longIsland: {
        position: [40.868282, -72.842895]
      },
      fingerLakes: { position: [42.727274, -76.836426]},
      lakeErie: { position: [42.419645, -79.436646]},
      niagraEscarpment: { position: [43.168962, -79.005821]},
      hudsonRiver: { position: [41.630632, -73.959698]}
    };

    $scope.venues = [
      { name: 'Whisper Vineyards', pos: {lat:40.870819, lng:-73.179245} },
      { name: 'Loughlin Vineyard', pos: {lat:40.735756, lng:-73.0734} }
    ]

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

    /*$scope.setMarkers = function(region) {
      angular.forEach(region.venues, function(venue) {
        console.log(venue.pos);
        $scope.setMarker(venue);
      });
    };*/

    $scope.showVenueOverlay = function(e,venue) {
      console.log(venue);
      $scope.activeVenue = venue;
      $scope.toggleMapOverlay();
    }

    $scope.toggleMapOverlay = function() {
      $scope.showMapOverlay = !$scope.showMapOverlay;
    }

    $scope.regionClick = function() {
      $scope.mapZoom = 10;
      $scope.mapCoordinates = [this.center.A, this.center.F];
    };

    // $scope.$on('mapInitialized', $scope.onMapInit);

    $scope.mapStyles = [
      {
          "featureType": "administrative.province",
          "elementType": "all",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "landscape",
          "elementType": "all",
          "stylers": [
              {
                  "saturation": -100
              },
              {
                  "lightness": 65
              },
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "poi",
          "elementType": "all",
          "stylers": [
              {
                  "saturation": -100
              },
              {
                  "lightness": 51
              },
              {
                  "visibility": "simplified"
              }
          ]
      },
      {
          "featureType": "road.highway",
          "elementType": "all",
          "stylers": [
              {
                  "saturation": -100
              },
              {
                  "visibility": "simplified"
              }
          ]
      },
      {
          "featureType": "road.arterial",
          "elementType": "all",
          "stylers": [
              {
                  "saturation": -100
              },
              {
                  "lightness": 30
              },
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "road.local",
          "elementType": "all",
          "stylers": [
              {
                  "saturation": -100
              },
              {
                  "lightness": 40
              },
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "transit",
          "elementType": "all",
          "stylers": [
              {
                  "saturation": -100
              },
              {
                  "visibility": "simplified"
              }
          ]
      },
      {
          "featureType": "transit",
          "elementType": "geometry.fill",
          "stylers": [
              {
                  "visibility": "on"
              }
          ]
      },
      {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
              {
                  "hue": "#ffff00"
              },
              {
                  "lightness": -25
              },
              {
                  "saturation": -97
              }
          ]
      },
      {
          "featureType": "water",
          "elementType": "labels",
          "stylers": [
              {
                  "visibility": "on"
              },
              {
                  "lightness": -25
              },
              {
                  "saturation": -100
              }
          ]
      }
    ];

    $scope.nyShape = [
      [42.5142, -79.7624],
      [42.7783, -79.0672],
      [42.8508, -78.9313],
      [42.9061, -78.9024],
      [42.9554, -78.9313],
      [42.9584, -78.9656],
      [42.9886, -79.0219],
      [43.0568, -79.0027],
      [43.0769, -79.0727],
      [43.1220, -79.0713],
      [43.1441, -79.0302],
      [43.1801, -79.0576],
      [43.2482, -79.0604],
      [43.2812, -79.0837],
      [43.4509, -79.2004],
      [43.6311, -78.6909],
      [43.6321, -76.7958],
      [43.9987, -76.4978],
      [44.0965, -76.4388],
      [44.1349, -76.3536],
      [44.1989, -76.3124],
      [44.2049, -76.2437],
      [44.2413, -76.1655],
      [44.2973, -76.1353],
      [44.3327, -76.0474],
      [44.3553, -75.9856],
      [44.3749, -75.9196],
      [44.3994, -75.8730],
      [44.4308, -75.8221],
      [44.4740, -75.8098],
      [44.5425, -75.7288],
      [44.6647, -75.5585],
      [44.7672, -75.4088],
      [44.8101, -75.3442],
      [44.8383, -75.3058],
      [44.8676, -75.2399],
      [44.9211, -75.1204],
      [44.9609, -74.9995],
      [44.9803, -74.9899],
      [44.9852, -74.9103],
      [45.0017, -74.8856],
      [45.0153, -74.8306],
      [45.0046, -74.7633],
      [45.0027, -74.7070],
      [45.0007, -74.5642],
      [44.9920, -74.1467],
      [45.0037, -73.7306],
      [45.0085, -73.4203],
      [45.0109, -73.3430],
      [44.9874, -73.3547],
      [44.9648, -73.3379],
      [44.9160, -73.3396],
      [44.8354, -73.3739],
      [44.8013, -73.3324],
      [44.7419, -73.3667],
      [44.6139, -73.3873],
      [44.5787, -73.3736],
      [44.4916, -73.3049],
      [44.4289, -73.2953],
      [44.3513, -73.3365],
      [44.2757, -73.3118],
      [44.1980, -73.3818],
      [44.1142, -73.4079],
      [44.0511, -73.4367],
      [44.0165, -73.4065],
      [43.9375, -73.4079],
      [43.8771, -73.3749],
      [43.8167, -73.3914],
      [43.7790, -73.3557],
      [43.6460, -73.4244],
      [43.5893, -73.4340],
      [43.5655, -73.3969],
      [43.6112, -73.3818],
      [43.6271, -73.3049],
      [43.5764, -73.3063],
      [43.5675, -73.2582],
      [43.5227, -73.2445],
      [43.2582, -73.2582],
      [42.9715, -73.2733],
      [42.8004, -73.2898],
      [42.7460, -73.2664],
      [42.4630, -73.3708],
      [42.0840, -73.5095],
      [42.0218, -73.4903],
      [41.8808, -73.4999],
      [41.2953, -73.5535],
      [41.2128, -73.4834],
      [41.1011, -73.7275],
      [41.0237, -73.6644],
      [40.9851, -73.6578],
      [40.9509, -73.6132],
      [41.1869, -72.4823],
      [41.2551, -72.0950],
      [41.3005, -71.9714],
      [41.3108, -71.9193],
      [41.1838, -71.7915],
      [41.1249, -71.7929],
      [41.0462, -71.7517],
      [40.6306, -72.9465],
      [40.5368, -73.4628],
      [40.4887, -73.8885],
      [40.5232, -73.9490],
      [40.4772, -74.2271],
      [40.4861, -74.2532],
      [40.6468, -74.1866],
      [40.6556, -74.0547],
      [40.7618, -74.0156],
      [40.8699, -73.9421],
      [40.9980, -73.8934],
      [41.0343, -73.9854],
      [41.3268, -74.6274],
      [41.3583, -74.7084],
      [41.3811, -74.7101],
      [41.4386, -74.8265],
      [41.5075, -74.9913],
      [41.6000, -75.0668],
      [41.6719, -75.0366],
      [41.7672, -75.0545],
      [41.8808, -75.1945],
      [42.0013, -75.3552],
      [42.0003, -75.4266],
      [42.0013, -77.0306],
      [41.9993, -79.7250],
      [42.0003, -79.7621],
      [42.1827, -79.7621],
      [42.5146, -79.7621],
    ]

  })
