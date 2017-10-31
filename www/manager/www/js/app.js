// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ionic-datepicker', 'starter.services', 'angular.filter', 'angularMoment', 'firebase', 'ngStorage', 'ngCordova', 'youtube-embed'])

.run(function($ionicPlatform, $rootScope, $ionicLoading, $state, Auth, $cordovaStatusbar, $cordovaSplashscreen, $cordovaTouchID, $localStorage) {
  $ionicPlatform.ready(function() {
    setTimeout(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
                }
    }, 300);
    setTimeout(function () {
            if (typeof $localStorage.enableTouchID === 'undefined' || $localStorage.enableTouchID === '' || $localStorage.enableTouchID === false) {
                //should already be on login page
                $state.go("login");
            } else {
                $cordovaTouchID.checkSupport().then(function () {
                    $cordovaTouchID.authenticate("All users with a Touch ID profile on the device will have access to this app").then(function () {
                        $state.go("loginauto");
                    }, function (error) {
                        console.log(JSON.stringify(error));
                        $state.go("login");
                    });
                }, function (error) {
                    console.log(JSON.stringify(error));
                    $state.go("login");
                });
            }
    }, 750);
    $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
            if (error === "AUTH_REQUIRED") {
                $ionicHistory.clearCache();
                $rootScope.authData = '';
                fb.unauth();
                $state.go("login");
            }
    });
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  var config = {
    apiKey: "AIzaSyDPCYH1iMoeShApBOpjy9TzTDI2c0S9u0s",
    authDomain: "pegaduan-395e6.firebaseapp.com",
    databaseURL: "https://pegaduan-395e6.firebaseio.com",
    projectId: "pegaduan-395e6",
    storageBucket: "pegaduan-395e6.appspot.com",
    messagingSenderId: "508166730489"
  };
  var fb = firebase.initializeApp(config);

  $stateProvider

  .state('login', {
    url: '/login',
    cache: false,
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('daftar', {
    url: '/daftar',
    cache: false,
    templateUrl: 'templates/daftar.html',
    controller: 'daftarCtrl'
  })

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.registrationHome', {
    url: '/registrationHome',
    views: {
      'menuContent': {
        templateUrl: 'templates/registrationHome.html',
        controller: 'userCtrl'
      }
    }
  })

  .state('app.registration', {
    url: '/registration/:userId',
    views: {
      'menuContent': {
        templateUrl: 'templates/registration.html',
        controller: 'registrationCtrl'
      }
    }
  })
  

  .state('app.profile', {
    url: '/profile',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile.html',
        controller: 'profileCtrl'
      }
    }
  })

  .state('app.detprofile', {
    url: '/detprofile/:profileId',
    views: {
      'menuContent': {
        templateUrl: 'templates/detprofile.html',
        controller: 'detprofileCtrl'
      }
    }
  })

  .state('app.dashboard', {
	url: '/dashboard/:memberId/:level',
	views: {
	'menuContent': {
	  templateUrl: 'templates/dashboard.html',
	  controller: 'dashboardCtrl'
	    }
	 }
  })

.state('app.tanggapan', {
    url: '/tanggapan',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/tanggapan.html',
        controller: 'tanggapanCtrl'
      }
    }
  })

.state('app.tanggapans', {
    url: '/tanggapans',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/tanggapans.html',
        controller: 'tanggapansCtrl'
      }
    }
  })

.state('app.pengaduan', {
    url: '/pengaduan',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/pengaduan.html',
        controller: 'pengaduanCtrl'
      }
    }
  })

.state('app.addtanggapan', {
    url: '/addtanggapann/:tanggapanId',
    views: {
      'menuContent': {
        templateUrl: 'templates/addtanggapan.html',
        controller: 'addtanggapanCtrl'
      }
    }
  })

.state('app.addpengaduan', {
    url: '/addpengaduan/:pengaduanId',
    views: {
      'menuContent': {
        templateUrl: 'templates/addpengaduan.html',
        controller: 'addpengaduanCtrl'
      }
    }
  })

.state('app.uploadcustomer', {
    url: '/uploadcustomer/:customerId',
    views: {
      'menuContent': {
        templateUrl: 'templates/uploadcustomer.html',
        controller: ''
      }
    }
  })

  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app');
});
