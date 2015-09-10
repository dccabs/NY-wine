'use strict';

/**
 * @ngdoc function
 * @name nyWineApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the nyWineApp
 */

angular.module('nyWineApp')
  .controller('MapCtrl', function ($scope,$location,$rootScope,$http,$timeout,$sce) {
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
    $scope.showMapIntroOverlay = true;
    $scope.showMapLegend = true;
    $scope.loading = false;
    $scope.showMenu = false;
    $scope.mapBounds = [[40.49909910896527,-79.79724120937499],[45.0409560293262,-71.82116699062499]];
    $scope.hideMap = false;
    $rootScope.device = "desktop";
    $scope.bookmarkedVenue = $location.search().venue;

    /* region data */

    $http.get('data/regions.json').
      success(function(data, status, headers, config) {
        $scope.regions = data;
    });


    /* get venue data */

    // $http.get('data/venues.json').
     $http.get('data/venues.json').
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

    $scope.activeRegions = function() {
      var entries = [];
      angular.forEach($scope.venues, function(venue) {
        if (entries.indexOf(venue.region)==-1) {
          entries.push(venue.region);
        }
      })
      return entries;
    }

    /* map functions */

    $scope.markers = [];
    $scope.mapZoom = 7;
    $scope.mapCoordinates = [42.7534979, -75.8092041];
    $scope.showMapOverlay = false;
    $scope.activeVenue = null;
    $scope.placeholderVenueImageUrl = 'https://placeholdit.imgix.net/~text?txtsize=66&txt=620×400&w=620&h=400';

    $scope.onMapInit = function(event, map) {

      $scope.google.maps.event.addListener(map, 'center_changed',
        $scope.onMapCenterChange);

      $scope.google.maps.event.addListener(map, 'zoom_changed', function() {
          var zoom = map.getZoom()
          if ($scope.infowindow) {
            $scope.infowindow.close();
          }
          $scope.showMapRegion = (zoom > 9) ? true : false;
          $scope.showMapLegend = (zoom < 8) ? true : false;
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
    };

    $scope.getMapZoomLevel = function() {
      return $scope.map.getZoom();
    };

    $scope.getCurrentRegion = function() {
      var currentRegion = $scope.findClosesetRegion()
      $scope.mapRegionClassName = currentRegion.name.toLowerCase().split(" ").join("-");
      $scope.mapRegionClassName = $scope.mapRegionClassName.split("/").join("-");
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
      if ($scope.infowindow) {
        $scope.infowindow.close();
      }
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

    $scope.regionClick = function(e,val) {
      $scope.loading = true;
      $timeout(function() {
        $scope.map.setZoom(10);
        $scope.mapCoordinates = [e.latLng.G, e.latLng.K];
      },50);
    };

    $scope.sanitize = function(val) {
      val = val.split("&#40;").join("(");
      val = val.split("&#41;").join(")");
      return $sce.trustAsHtml(val);
    }

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
        $scope.map.setZoom(11);
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

    /* search functions */

    $scope.searchTxt = {};
    $scope.searchTxt.name = "";
    $scope.infowindow = null;

    $scope.selectVenue = function(venue) {
      $scope.loading = true;
      var windowLatLng = new google.maps.LatLng(venue.coordinates[0]+.004,venue.coordinates[1]);

      if ($scope.infowindow) {
        $scope.infowindow.close();
      }
      $scope.infowindow = new google.maps.InfoWindow({
        content: "<h5>"+venue.name+"</h5> <div>Click on the icon for more information",
        position: windowLatLng
      });

     $timeout(function() {
        $scope.map.setZoom(13);
        $scope.mapCoordinates = venue.coordinates;
        $scope.searchTxt.name = "";
        $timeout(function() {
          $scope.infowindow.open($scope.map);
        });
     },50);

    }

    $scope.hoverVenue = function(e,venue) {
      var zoom = $scope.map.getZoom();
      var pad = .030;

      if (zoom == 8) {
        pad = .1;
      }

      if (zoom == 9) {
        pad = .055;
      }

      if (zoom == 11) {
        pad = .015;
      }
      if (zoom == 12) {
        pad = .008;
      }
      if (zoom == 13) {
        pad = .004;
      }
      if (zoom == 14) {
        pad = .002;
      }
      if (zoom == 15) {
        pad = .001;
      }
      if (zoom == 16) {
        pad = .0005;
      }


      var windowLatLng = new google.maps.LatLng(venue.coordinates[0]+pad,venue.coordinates[1]);

      if ($scope.infowindow) {
        $scope.infowindow.close();
      }
      $scope.infowindow = new google.maps.InfoWindow({
        content: "<h5>"+venue.name+"</h5> <div>Click on the icon for more information",
        position: windowLatLng
      });
      $scope.infowindow.open($scope.map);

    }

    /* end Overlay functions */

    $scope.toggleMapIntroOverlay = function() {
      $scope.showMapIntroOverlay = !$scope.showMapIntroOverlay;
    };

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
                  "saturation": 100
              },
              {
                  "lightness": 90
              },
              {
                  "visibility": "off"
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
                  "visibility": "on"
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

  $scope.nyOutline = [[42.5142, -79.7624],
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
      [42.5146, -79.7621]];

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

