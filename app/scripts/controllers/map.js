'use strict';

/**
 * @ngdoc function
 * @name nyWineApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the nyWineApp
 */

angular.module('nyWineApp')
  .controller('MapCtrl', function ($scope,$location,$rootScope,$http,$timeout) {
    /* init variables */

    $scope.attractions = null;
    $scope.wineries = null;
    $scope.hotels = null;
    $scope.restaurants = null;
    $scope.hideWineries = false;
    $scope.hideHotels = false;
    $scope.hideAttractions = false;
    $scope.hideRestaurants = false;
    $scope.mapRegion = null;
    $scope.mapRegionClass = null;
    $scope.showMapRegion = false;
    $scope.loading = false;
    $scope.showMenu = false;
    $scope.mapBounds = [[40.49909910896527,-79.79724120937499],[45.0409560293262,-71.82116699062499]];
    $scope.hideMap = false;
    $rootScope.device = "desktop";
    $scope.bookmarkedVenue = $location.search().venue;

    /* region data */
    $scope.regions = [
      {
        name: 'Long Island',
        pos: { lat: 40.868282, lng: -72.842895 }
      },
      {
        name: 'New York City',
        pos: { lat: 40.71448, lng: -74.00598 }
      },
      {
        name: 'Hudson River',
        pos: { lat: 41.630632, lng: -73.959698 }
      },
      {
        name: 'Finger Lakes',
        pos: { lat: 42.8159758, lng: -76.9312001 }
      },
      {
        name: 'Lake Erie',
        pos: { lat: 42.419645, lng: -79.436646 }
      },
      {
        name: 'Niagra',
        pos: { lat: 43.168962, lng: -79.005821 }
      },
      {
        name: 'Other Western Counties',
        pos: { lat: 42.295065, lng: -78.387863 }
      },
      {
        name: 'Lake Ontario',
        pos: { lat: 43.275033, lng: -77.229369 }
      },
      {
        name: 'Central New York',
        pos: { lat: 42.674451, lng: -74.432814 }
      },
    ];

    /* get venue data */

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

        /* build regions object */

        angular.forEach($scope.regions, function(region) {
          var name = region.name;

          region.venues = _.filter($scope.venues, function(venue) {
            return venue.region==region.name;
          });

          region.subRegions = []

          angular.forEach(region.venues, function(venue) {

            if (region.subRegions.indexOf(venue.sub_region)==-1 && venue.sub_region !=null && venue.sub_region !="") {
              region.subRegions.push(venue.sub_region);
            }
          });

        });
        /* end build regions object */
      });

    /* map functions */

    $scope.markers = [];
    $scope.mapZoom = 7;
    $scope.mapCoordinates = [42.7534979, -75.8092041];
    $scope.showMapOverlay = false;
    $scope.activeVenue = null;
    $scope.placeholderVenueImageUrl = 'https://placeholdit.imgix.net/~text?txtsize=66&txt=620×400&w=620&h=400';

    $scope.onMapInit = function(event, map) {
      console.log('mapInitialized!');
      $scope.google.maps.event.addListener(map, 'center_changed',
        $scope.onMapCenterChange);

      $scope.google.maps.event.addListener(map, 'zoom_changed', function() {
          var zoom = map.getZoom()
          if (zoom > 9) {
            $scope.showMapRegion = true;
          }
          else {
            $scope.showMapRegion = false;
          }
          $scope.resizeMap();
      });
    };

    $scope.$on('mapInitialized', $scope.onMapInit);

    $scope.resizeMap = function() {
      if (!$scope.showMapRegion) {
        $('#map-container').find('.map').removeAttr('style');
        $('.map-overlay').removeAttr('style');
        $timeout(function() {
          $scope.loading = false;
        },100);
        return;
      }

      var w = window.innerWidth;
      var mapWidth = w - 315;
      console.log('small resize')
      $('#map-container').find('.map').width(mapWidth);
      $('.map-overlay').width(mapWidth);
      $timeout(function() {
          $scope.loading = false;
        });
    };

    $scope.resetMap = function() {
      $scope.map.setZoom(7);
      $scope.mapCoordinates = [42.7534979, -75.8092041];
    }

    $scope.getMapZoomLevel = function() {
      return $scope.map.getZoom();
    };

    $scope.getCurrentRegion = function() {
      var currentRegion;
      angular.forEach($scope.regions, function(region) {
        var latLng = new $scope.google.maps.LatLng(region.pos.lat,region.pos.lng);
        if ($scope.map.getBounds().contains(latLng)) {
          currentRegion = region;
        }
      });
      if (currentRegion) $scope.mapRegionClassName = currentRegion.name.toLowerCase().replace(" ", "-");
      return currentRegion;
    };

    $scope.isMarkerInMapBounds = function(marker) {
      return $scope.map.getBounds().contains(marker.getPosition());
    };

    $scope.toggleMarkers = function(type) {
      if (type=='wineries') $scope.hideWineries = !$scope.hideWineries;
      if (type=='restaurants') $scope.hideRestaurants = !$scope.hideRestaurants;
      if (type=='attractions') $scope.hideAttractions = !$scope.hideAttractions;
      if (type=='hotels') $scope.hideHotels = !$scope.hideHotels;
    }

    $scope.onMapCenterChange = function() {
      $timeout(function() {
        $scope.mapRegion = $scope.getCurrentRegion();
        $scope.$apply();
      });
    };

    $scope.onMarkerClick = function() {
      $('#map-overlay')
        .addClass('is-visible')
        .find('.title')
        .html(this.title);
    };

    $scope.mapZoomIn = function() {
      $scope.map.setZoom($scope.map.getZoom() + 1);
    };

    $scope.mapZoomOut = function() {
      $scope.map.setZoom($scope.map.getZoom() - 1);
    };

    $scope.regionClick = function(e) {
      $scope.loading = true;
      $timeout(function() {
        $scope.map.setZoom(10);
        $scope.mapCoordinates = [e.latLng.A, e.latLng.F];
      },50);
    };

    /* end map functions */

    /* menu functions */

    $scope.menuRegionClick = function(region) {
      $scope.loading = true;
      $scope.toggleMenu();
      $timeout(function() {
        $scope.map.setZoom(10);
        $scope.mapCoordinates = [region.pos.lat, region.pos.lng];
      },50);
    }

    $scope.toggleMenu = function() {
      $scope.showMenu = !$scope.showMenu;
    }

    /* end menu functions */

    /* Overlay functions */

    $scope.onOverlayCloseBtnClick = function() {
      $('#map-overlay')
        .removeClass('is-visible')
        .find('.title')
        .html('');
    };

    $scope.showVenueOverlay = function(e,venue) {
      // $scope.overlayBackgroundImage = $scope.getMatchingStaticMapImage();
      $scope.activeVenue = venue;
      $scope.toggleMapOverlay();
    };

    $scope.toggleMapOverlay = function() {
      $scope.showMapOverlay = !$scope.showMapOverlay;
    };

    $scope.getMapWidth = function() {
      var w = $('#map').width();
      return w;
    }

    /* end Overlay functions */

    /* venu specific link function */

    $scope.$watch('bookmarkedVenue', function() {
      var match = _.filter($scope.venues, function(ven){ return ven.name==$scope.bookmarkedVenue; });
      if (!match.length) return;

      match = match[0];
      $scope.mapZoom = 10;
      $scope.mapCoordinates = [match.coordinates];
      $scope.activeVenue = match;
      $scope.showMapOverlay = true;
    });

    /* styles for map */

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
                  "visibility": "off"
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
                  "visibility": "off"
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
                  "visibility": "off"
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
                  "visibility": "off"
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

    /* end map styles */

  })
  .filter('plusify',function() {
    return function(input) {
        if (input) {
            return input.replace(/\s+/g, '+');
        }
    }
  })
  .directive('resizemap', function() {
    return function(scope, element, attrs) {
      $(window).on('resize', scope.resizeMap);
    }
  });

