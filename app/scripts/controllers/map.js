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
    $scope.mapRegionClassName = null;
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
        pos: { lat: 40.736132, lng: -73.077927 },
        sub_regions : [{
          name: 'The Hamptons',
          pos: { lat: 40.901891, lng: -72.366950 }
        },
        {
          name: 'North Fork',
          pos: { lat: 41.045646, lng: -72.439966 }
        },
        {
          name: 'Central',
          pos: { lat: 40.806777, lng: -73.246613 }
        }]
      },
      {
        name: 'New York City',
        pos: { lat: 40.71448, lng: -74.00598 },
        sub_regions: [{
          name : 'Bronx',
          pos: { lat: 40.828187, lng: -73.911692 }
        },
        {
          name : 'Manhattan',
          pos: { lat: 40.719065, lng: -74.009969 }
        },
        {
          name : 'Queens',
          pos: { lat: 40.717947, lng: -73.835466 }
        },
        {
          name : 'Brooklyn',
          pos: { lat: 40.665027, lng: -73.945215 }
        }]
      },
      {
        name: 'Hudson River',
        pos: { lat: 41.857170, lng: -73.970232 }
      },
      {
        name: 'Finger Lakes',
        pos: { lat: 42.627888, lng: -76.867026 },
        sub_regions : [{
          name: 'Canandaigua Lake',
          pos: { lat: 42.875957, lng: -77.273387 }
        },
        {
          name: 'Cayuga Lake',
          pos: { lat: 42.754504, lng: -76.702667 }
        },
        {
          name: 'Conesus & Hemlock Lakes',
          pos: { lat: 42.822945, lng: -77.718852 }
        },
        {
          name: 'Keuka Lake',
          pos: { lat: 42.485131, lng: -77.138742 }
        },
        {
          name: 'Owasco Lake',
          pos: { lat: 42.662386, lng: -76.393007 }
        },
        {
          name: 'Seneca Lake',
          pos: { lat: 42.617262, lng: -76.921993 }
        },
        {
          name: 'Skaneateles Lake',
          pos: { lat: 42.888487, lng: -76.418161 }
        }]
      },
      {
        name: 'Lake Erie',
        pos: { lat: 42.188784, lng: -79.723930 }
      },
      {
        name: 'Niagra',
        pos: { lat: 43.296409, lng: -78.715268 }
      },
      {
        name: 'Other Western Counties',
        pos: { lat: 42.305448, lng: -78.017090 }
      },
      {
        name: 'Lake Ontario',
        pos: { lat: 43.116777, lng: -77.314405 }
      },
      {
        name: 'Central New York',
        pos: { lat: 42.583077, lng: -74.591432 }
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
      //$('#map-container').find('.map').width(mapWidth);
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
      var currentRegion = $scope.findClosesetRegion()
      $scope.mapRegionClassName = currentRegion.name.toLowerCase().split(" ").join("-");
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
      //return;
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
      $scope.showMapOverlay = false;
      $timeout(function() {
        $scope.map.setZoom(10);
        $scope.mapCoordinates = [region.pos.lat, region.pos.lng];
      },50);
    }

    $scope.menuSubRegionClick = function(sub_region, region) {
      $scope.loading = true;
      $scope.toggleMenu();
      $scope.showMapOverlay = false;
      $timeout(function() {
        $scope.mapCoordinates = [sub_region.pos.lat, sub_region.pos.lng];
        $scope.map.setZoom(12);
        // $scope.mapRegion = region;
        // $scope.mapRegionClassName = region.name.toLowerCase().split(" ").join("-");
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
      if ($scope.showMapRegion) w = w -315;
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


  $scope.rad = function(x) {
      return x*Math.PI/180;
  }

  $scope.findClosesetRegion = function () {
    var center = $scope.map.getCenter();
    var lat = center.lat();
    var lng = center.lng();
    var R = 6371; // radius of earth in km
    var distances = [];
    var closest = -1;
    var i;
    for( i=0;i<$scope.regions.length; i++ ) {
        var mlat = $scope.regions[i].pos.lat;
        var mlng = $scope.regions[i].pos.lng;
        var dLat  = $scope.rad(mlat - lat);
        var dLong = $scope.rad(mlng - lng);
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos($scope.rad(lat)) * Math.cos($scope.rad(lat)) * Math.sin(dLong/2) * Math.sin(dLong/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        distances[i] = d;
        if ( closest == -1 || d < distances[closest] ) {
            closest = i;
        }
    }
    return $scope.regions[closest]
  }

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

