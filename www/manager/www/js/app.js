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
    apiKey: "AIzaSyDtoRohubH-ksh7g82fdM0lL4mRH7jjNx8",
    authDomain: "salesranger-1f7f4.firebaseapp.com",
    databaseURL: "https://salesranger-1f7f4.firebaseio.com",
    projectId: "salesranger-1f7f4",
    storageBucket: "salesranger-1f7f4.appspot.com",
    messagingSenderId: "684372826209"
  };
  var fb = firebase.initializeApp(config);
  $stateProvider

  .state('login', {
    url: '/login',
    cache: false,
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
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

  .state('app.product', {
    url: '/product',
    views: {
      'menuContent': {
        templateUrl: 'templates/product.html',
        controller: 'productCtrl'
      }
    }
  })

  .state('app.addproduct', {
    url: '/addproduct/:productId',
    views: {
      'menuContent': {
        templateUrl: 'templates/addproduct.html',
        controller: 'addproductCtrl'
      }
    }
  })

  .state('app.blog', {
    url: '/blog',
    views: {
      'menuContent': {
        templateUrl: 'templates/blog.html',
        controller: 'blogCtrl'
      }
    }
  })

.state('app.kontrolHarian', {
    url: '/kontrolHarian',
    views: {
      'menuContent': {
        templateUrl: 'templates/kontrolHarian.html',
        controller: ''
      }
    }
  })

  .state('app.KontrolBulanan', {
    url: '/kontrolBulanan',
    views: {
      'menuContent': {
        templateUrl: 'templates/kontrolBulanan.html',
        controller: ''
      }
    }
  })  

  .state('app.addblog', {
    url: '/addblog/:blogId',
    views: {
      'menuContent': {
        templateUrl: 'templates/addblog.html',
        controller: 'addblogCtrl'
      }
    }
  })

  .state('app.overview', {
    url: '/overview',
    views: {
      'menuContent': {
        templateUrl: 'templates/overview.html',
        controller: 'overviewCtrl'
      }
    }
  })

  .state('app.editoverview', {
    url: '/editoverview/:overviewId',
    views: {
      'menuContent': {
        templateUrl: 'templates/editoverview.html',
        controller: 'editoverviewCtrl'
      }
    }
  })

  .state('app.addoverview', {
    url: '/addoverview',
    views: {
      'menuContent': {
        templateUrl: 'templates/addoverview.html',
        controller: 'addoverviewCtrl'
      }
    }
  })

  .state('app.info', {
    url: '/info',
    views: {
      'menuContent': {
        templateUrl: 'templates/info.html',
        controller: 'infoCtrl'
      }
    }
  })

  .state('app.editinfo', {
    url: '/editinfo/:informationId',
    views: {
      'menuContent': {
        templateUrl: 'templates/editinfo.html',
        controller: 'editinfoCtrl'
      }
    }
  })

  .state('app.addinfo', {
    url: '/addinfo',
    views: {
      'menuContent': {
        templateUrl: 'templates/addinfo.html',
        controller: 'addinfoCtrl'
      }
    }
  })

  .state('app.tag', {
    url: '/tag',
    views: {
      'menuContent': {
        templateUrl: 'templates/tag.html',
        controller: 'tagCtrl'
      }
    }
  })

  .state('app.edittag', {
    url: '/edittag/:tagId',
    views: {
      'menuContent': {
        templateUrl: 'templates/edittag.html',
        controller: 'edittagCtrl'
      }
    }
  })

  .state('app.addtag', {
    url: '/addtag',
    views: {
      'menuContent': {
        templateUrl: 'templates/addtag.html',
        controller: 'addtagCtrl'
      }
    }
  })

  .state('app.feature', {
    url: '/feature',
    views: {
      'menuContent': {
        templateUrl: 'templates/feature.html',
        controller: 'featureCtrl'
      }
    }
  })

  .state('app.editfeature', {
    url: '/editfeature/:featureId',
    views: {
      'menuContent': {
        templateUrl: 'templates/editfeature.html',
        controller: 'editfeatureCtrl'
      }
    }
  })

  .state('app.addfeature', {
    url: '/addfeature',
    views: {
      'menuContent': {
        templateUrl: 'templates/addfeature.html',
        controller: 'addfeatureCtrl'
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

.state('app.customer', {
    url: '/customer',
    views: {
      'menuContent': {
        templateUrl: 'templates/customer.html',
        controller: 'customerCtrl'
      }
    }
  })

.state('app.addcustomer', {
    url: '/addcustomer/:customerId',
    views: {
      'menuContent': {
        templateUrl: 'templates/addcustomer.html',
        controller: 'addcustomerCtrl'
      }
    }
  })
.state('app.assigncustomer', {
    url: '/assigncustomer/:customerId',
    views: {
      'menuContent': {
        templateUrl: 'templates/assigncustomer.html',
        controller: 'assigncustomerCtrl'
      }
    }
  })
.state('app.atribut', {
    url: '/atribut',
    views: {
      'menuContent': {
        templateUrl: 'templates/atribut.html',
        controller: 'registrationCtrl'
      }
    }
  })
.state('app.addatribut', {
    url: '/addatribut',
    views: {
      'menuContent': {
        templateUrl: 'templates/addatribut.html',
        controller: 'registrationCtrl'
      }
    }
  })
.state('app.actcustomer', {
    url: '/actcustomer',
    views: {
      'menuContent': {
        templateUrl: 'templates/actcustomer.html',
        controller: ''
      }
    }
  })
.state('app.actagen', {
    url: '/actagen',
    views: {
      'menuContent': {
        templateUrl: 'templates/actagen.html',
        controller: 'taskCtrl'
      }
    }
  })
.state('app.agen', {
    url: '/agen',
    views: {
      'menuContent': {
        templateUrl: 'templates/agen.html',
        controller: 'agenCtrl'
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
