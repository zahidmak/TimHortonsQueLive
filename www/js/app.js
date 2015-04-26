// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ngCordova', 'starter.controllers', 'uiGmapgoogle-maps'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  
  .state('app.home', {
    url: "/home",
    views: {
      'menuContent': {
        templateUrl: "templates/home.html"
      }
    }
  })

  .state('app.weather', {
    url: "/weather",
    views: {
      'menuContent': {
        templateUrl: "templates/weather.html",
        controller: 'AppCtrl'

      }
    }
  })

  .state('app.findTims', {
    url: "/findTims",
    views: {
      'menuContent': {
        templateUrl: "templates/findTims.html",
        controller: 'AppCtrl'

      }
    }
  })

 
 .state('app.about', {
      url: "/about",
      views: {
        'menuContent': {
          templateUrl: "templates/about.html",
          controller: 'AppCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');

  uiGmapGoogleMapApiProvider.configure({

      v: '3.17',
      libraries: 'weather, geometry, visualization , places'
  });

});
