angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, CurrentUserService, $ionicPopup, TransactionFactory, myCache, $ionicHistory, $state, $rootScope) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  $scope.logOut = function () {
      
      firebase.auth().signOut().then(function() {
        $ionicHistory.clearCache();
        $state.reload('app');
        $scope.isAdmin = false;
        $scope.isPublic = false;
        $scope.isPejabat = false;
        $state.go("login");
      }, function(error) {
        $ionicPopup.alert({title: 'Logout Failed', template: error});
      });
      
  };// End logOut

  // Triggered in the login modal to close it
  

  $scope.update = function() {
    if ($scope.level === "Masyarakat") {
      $scope.isPublic = true;
    } else if ($scope.level === "Admin") {
      $scope.isAdmin = true;
      $scope.isPublic = true;
      $scope.isPejabat = true;
    } else if ($scope.level === "Pejabat") {
      $scope.isPejabat = true;
    } else if ($scope.level === "Kepala Daerah") {
      $scope.isAdmin = true;
      $scope.isPublic = true;
      $scope.isPejabat = true;
    }
  };

  

  $scope.$on('$ionicView.beforeEnter', function () {
    $scope.fullname = CurrentUserService.fullname;
    $scope.photo = CurrentUserService.picture;
    $scope.level = CurrentUserService.level;
    $scope.userid = myCache.get('thisMemberId');
    $scope.update();
  });

  $scope.message = "";
  $scope.trigmessage = function() {
    if ($scope.message === "") {
        $scope.message = "open";
    } else if ($scope.message === "open") {
        $scope.message = "";
    }
    refresh($scope.emails, $scope, TransactionFactory);
  };

  $scope.profile = "";
  $scope.trigprofile = function() {
    if ($scope.profile === "") {
        $scope.profile = "open";
    } else if ($scope.profile === "open") {
        $scope.profile = "";
    }
  };

  $scope.home = "";
  $scope.trighome = function() {
    if ($scope.home === "") {
        $scope.home = "active";
        $scope.homeshow = "display: block;";
    } else if ($scope.home === "active") {
        $scope.home = "";
        $scope.homeshow = "display: none;";
    }
  };
  $scope.cont = "";
  $scope.trigcont = function() {
    if ($scope.cont === "") {
        $scope.cont = "active";
        $scope.contshow = "display: block;";
    } else if ($scope.cont === "active") {
        $scope.cont = "";
        $scope.contshow = "display: none;";
    }
  };
  $scope.mast = "";
  $scope.trigmast = function() {
    if ($scope.mast === "") {
        $scope.mast = "active";
        $scope.mastshow = "display: block;";
    } else if ($scope.mast === "active") {
        $scope.mast = "";
        $scope.mastshow = "display: none;";
    }
  };
  $scope.sett = "";
  $scope.trigsett = function() {
    if ($scope.sett === "") {
        $scope.sett = "active";
        $scope.settshow = "display: block;";
    } else if ($scope.sett === "active") {
        $scope.sett = "";
        $scope.settshow = "display: none;";
    }
  };
  $scope.adm = "";
  $scope.trigadm = function() {
    if ($scope.adm === "") {
        $scope.adm = "active";
        $scope.admshow = "display: block;";
    } else if ($scope.adm === "active") {
        $scope.adm = "";
        $scope.admshow = "display: none;";
    }
  };

  $scope.emails = [];
  $scope.emails = TransactionFactory.getEmails();
  $scope.emails.$loaded().then(function (x) {
    refresh($scope.emails, $scope, TransactionFactory);
  }).catch(function (error) {
      console.error("Error:", error);
  });

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  function refresh(emails, $scope, item) {
    var notif = 0;
    var index;
    //
    for (index = 0; index < emails.length; ++index) {
        //
        var mail = emails[index];
        //
        if (mail.open === false) {
            notif = notif + 1;
        }
    }
    $scope.notify = notif;
  }
})

.controller('dashboardCtrl', function($scope, $state, $timeout, $ionicModal, $ionicLoading, MembersFactory, $ionicPopup, CurrentUserService, PickTransactionServices, $filter, $cordovaGeolocation, myCache, TransactionFactory, ContactsFactory, AccountsFactory, MasterFactory, $compile) {

  $scope.baru = 0;
  $scope.selesai = 0;
  $scope.belum = 0;
  $scope.persenselesai = 0;
  $scope.persenbelum = 0;
  $scope.adus = 0;

  $scope.doRefresh = function (){
    $scope.baru = 0;
    $scope.selesai = 0;
    $scope.belum = 0;
    $scope.persenselesai = 0;
    $scope.persenbelum = 0;
    $scope.jlhadu = 0;

    $scope.adus = [];
    $scope.adus = MembersFactory.getPengaduans();
    $scope.adus.$loaded().then(function (x) {
      var jlh = 0;
      var pbaru = 0;
      var pselesai = 0;
      var pbelum = 0;
      var index;
      //
      for (index = 0; index < $scope.adus.length; ++index) {
          //
          var adu = $scope.adus[index];
          //
          if (adu.$id !== '') {
              jlh = jlh + 1;
          }
          if (adu.statusPengaduan === 'Baru') {
              pbaru = pbaru + 1;
          }
          if (adu.statusPengaduan === 'Done') {
              pselesai = pselesai + 1;
          }
          if (adu.statusPengaduan === 'On Progress') {
              pbelum = pbelum + 1;
          }
      }
      var persel = parseFloat(pselesai) / parseFloat(jlh);
      var perbel = parseFloat(pbelum) / parseFloat(jlh);
      $scope.jlhadu = jlh;
      $scope.baru = pbaru;
      $scope.selesai = pselesai;
      $scope.belum = pbelum;
      $scope.persenselesai = persel.toFixed(2) * 100;
      $scope.persenbelum = perbel.toFixed(2) * 100;
      
    }).catch(function (error) {
        console.error("Error:", error);
    });

    
  };

  $ionicModal.fromTemplateUrl('templates/addpengaduan.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.close = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.addPengaduan = function() {
    $scope.modal.show();
  };

  var options = {timeout: 10000, enableHighAccuracy: true};

  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
 
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var infowindow = new google.maps.InfoWindow();
    
 
    var mapOptions = {
      center: latLng,
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    var input = document.getElementById('cari');
    var searchBox = new google.maps.places.SearchBox(input);
    $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    $scope.map.addListener('bounds_changed', function() {
      searchBox.setBounds($scope.map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };
        // Create a marker for each place.
        var markers = new google.maps.Marker({
          map: $scope.map,
          icon: icon,
          title: place.name,
          animation: google.maps.Animation.DROP,
          position: place.geometry.location
        });

        google.maps.event.addListener(markers, 'click', function() {
          $scope.pengaduan.locationPengaduan = place.name;
          $scope.pengaduan.locDetailPengaduan = place.formatted_address;
          $scope.pengaduan.latPengaduan = place.geometry.location.lat();
          $scope.pengaduan.lngPengaduan = place.geometry.location.lng();
          $scope.isLocation = true;
          infowindow.setContent('<div ng-click="set()"><strong>' + place.name + '</strong><br>'+
              place.formatted_address + '<strong> Berikan aduan disini?</strong></div>');
          infowindow.open($scope.map, markers);
          $scope.modal.show();
        });

        $scope.set = function () {
          $scope.propose.location = place.name;
          $scope.isLocation = true;
        };

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
        
      });
      $scope.map.fitBounds(bounds);
    });

    google.maps.event.addListenerOnce($scope.map, 'idle', function(){

      var image = {
        url: $scope.photo,
        // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(25, 25),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      var marker = new google.maps.Marker({
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          position: latLng,
          icon: image
      });      
     
      var infoWindow = new google.maps.InfoWindow({
          content: $scope.fullname
      });
     
      google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open($scope.map, marker);
      });
    });
  }, function(error){
    console.log("Could not get location");
  });

  $scope.users = AccountsFactory.getUsers();
  $scope.users.$loaded().then(function (x) {
    $scope.doRefresh();
  }).catch(function (error) {
      console.error("Error:", error);
  });

  $scope.takepic = function() {
    
    var filesSelected = document.getElementById("nameImg").files;
    if (filesSelected.length > 0) {
      var fileToLoad = filesSelected[0];
      var fileReader = new FileReader();
      fileReader.onload = function(fileLoadedEvent) {
        var textAreaFileContents = document.getElementById(
          "textAreaFileContents"
        );
        $scope.item = {
          photo: fileLoadedEvent.target.result
        };
        PickTransactionServices.updatePhoto($scope.item.photo);
        $scope.uploaded();
      };
      fileReader.readAsDataURL(fileToLoad);
    }
  };

  $scope.createPengaduan = function (pengaduan) {
      var filesSelected = document.getElementById("nameImg").files;
      if (filesSelected.length > 0) {
        var fileToLoad = filesSelected[0];
        var fileReader = new FileReader();
        fileReader.onload = function(fileLoadedEvent) {
          var textAreaFileContents = document.getElementById(
            "textAreaFileContents"
          );
          $scope.item = {
            photo: fileLoadedEvent.target.result
          };
          PickTransactionServices.updatePhoto($scope.item.photo);
        };

        fileReader.readAsDataURL(fileToLoad);
      }

      // Validate form data
      if (typeof pengaduan.locationPengaduan === 'undefined' || pengaduan.locationPengaduan === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Pengaduan failed', template: 'Lokasi belum dipilih!'});
          return;
      }
      if (typeof pengaduan.komentarPengaduan === 'undefined' || pengaduan.komentarPengaduan === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Pengaduan failed', template: 'Pengaduan belum diisi!'});
          return;
      }

      if (typeof $scope.item.photo === 'undefined' || $scope.item.photo === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Pengaduan failed', template: 'Foto bukti pengaduan belum dilampirkan'});
          return;
      }

      if ($scope.inEditMode) {
        $ionicLoading.show({
            template: '<ion-spinner icon="ios"></ion-spinner><br>Editing...'
        });
        var photo = $scope.item.photo;
        var picPengaduan = $scope.fullname;
        var idPicPengaduan = $scope.userid;
        var statusPengaduan = 'Baru';
        $scope.temp = {
            locationPengaduan: $scope.pengaduan.locationPengaduan,
            latPengaduan: $scope.pengaduan.latPengaduan,
            lngPengaduan: $scope.pengaduan.lngPengaduan,
            locDetailPengaduan: $scope.pengaduan.locDetailPengaduan,
            komentarPengaduan: pengaduan.komentarPengaduan,
            picture: photo,
            datePengaduan: $scope.pengaduan.datePengaduan,
            statusPengaduan: statusPengaduan,
            picPengaduan: picPengaduan,
            idPicPengaduan: idPicPengaduan,
            datecreated: Date.now(),
            dateupdated: Date.now()
        }

        /* SAVE MEMBER DATA */
        var pengref = MembersFactory.pRef();
        var newAdu = pengref.child($stateParams.tanggapanId);
        newAdu.update($scope.temp);
        
        var membersref = MembersFactory.ref();
        var newUser = membersref.child($scope.userid).child("adus").child($stateParams.tanggapanId);
        newUser.update($scope.temp);

        $ionicLoading.hide();
        $scope.modal.hide();


      }else {
      //PREPARE FOR DATABASE
        $ionicLoading.show({
            template: '<ion-spinner icon="ios"></ion-spinner><br>Processing...'
        });
        /* PREPARE DATA FOR FIREBASE*/
        var photo = $scope.item.photo;
        var picPengaduan = $scope.fullname;
        var idPicPengaduan = $scope.userid;
        var statusPengaduan = 'Baru';
        $scope.temp = {
            locationPengaduan: $scope.pengaduan.locationPengaduan,
            latPengaduan: $scope.pengaduan.latPengaduan,
            lngPengaduan: $scope.pengaduan.lngPengaduan,
            locDetailPengaduan: $scope.pengaduan.locDetailPengaduan,
            komentarPengaduan: pengaduan.komentarPengaduan,
            picture: photo,
            datePengaduan: $scope.pengaduan.datePengaduan,
            statusPengaduan: statusPengaduan,
            picPengaduan: picPengaduan,
            idPicPengaduan: idPicPengaduan,
            datecreated: Date.now(),
            dateupdated: Date.now()
        }

        /* SAVE MEMBER DATA */
        var pengref = MembersFactory.pRef();
        var newChildRef = pengref.push($scope.temp);
        var newAdu = newChildRef.key;
        var membersref = MembersFactory.ref();
        var newUser = membersref.child($scope.userid).child("adus").child(newAdu);
        newUser.update($scope.temp);

        $ionicLoading.hide();
        $scope.modal.hide();
        $ionicPopup.alert({title: 'Input Success', template: 'Input pengaduan berhasil'});
      }
  };

  $scope.uploaded = function () {
    $scope.item = { photo: PickTransactionServices.photoSelected };
  };

  $scope.$on('$ionicView.beforeEnter', function () {
    $scope.fullname = CurrentUserService.fullname;
    $scope.photo = CurrentUserService.picture;
    $scope.level = CurrentUserService.level;
    $scope.userid = myCache.get('thisMemberId');
    if ($scope.level === 'Admin' || $scope.level === 'Kepala Daerah') {
      $scope.isShow = true;
    }
    $scope.pengaduan = {'datePengaduan': '','locationPengaduan': '','latPengaduan': '','lngPengaduan': '','locDetailPengaduan':'','komentarPengaduan':'','picturePengaduan':''};
    $scope.pengaduan.datePengaduan = $filter("date")(Date.now(), 'yyyy-MM-dd');
    refresh($scope.blogs, $scope.emails, $scope.overviews, $scope.users, $scope);
  });

  function refresh(blogs, emails, overviews, users, $scope, item) {
    
  }
})

.controller('registrationCtrl', function($scope, $state, $ionicLoading, MembersFactory, CurrentUserService, PickTransactionServices, $ionicPopup, myCache, $stateParams, $ionicHistory) {

  $scope.$on('$ionicView.beforeEnter', function () {
    if ($scope.user.picture === ""){
       $scope.item.photo = PickTransactionServices.photoSelected;
    } else {
      $scope.item = {'photo': $scope.user.picture};
    }
  });

  // Gender
  $scope.trigmale = function() {
    $scope.male = "checked";
    $scope.female = "";
    $scope.gender = "Laki-laki";
  };
  $scope.trigfemale = function() {
    $scope.male = "";
    $scope.female = "checked";
    $scope.gender = "Perempuan";
  };

  // User Level
  
  $scope.trigadmin = function() {
    $scope.admin = "checked";
    $scope.agen = "";
    $scope.headsales = "";
    $scope.manager = "";
    $scope.level = "Admin";
  };
  $scope.trigagen = function() {
    $scope.admin = "";
    $scope.agen = "checked";
    $scope.headsales = "";
    $scope.manager = "";
    $scope.level = "Masyarakat";
  };
  $scope.trigheadsales = function() {
    $scope.admin = "";
    $scope.agen = "";
    $scope.headsales = "checked";
    $scope.manager = "";
    $scope.level = "Pejabat";
  };
  $scope.trigmanager = function() {
    $scope.admin = "";
    $scope.agen = "";
    $scope.headsales = "";
    $scope.manager = "checked";
    $scope.level = "Kepala Daerah";
  };

  if ($stateParams.userId === '') {
      $scope.user = {'fullname': '','email': '','picture': '','gender': ''};
      $scope.item = {'photo': '', 'picture':''};
      $scope.male = "";
      $scope.female = "";
      $scope.admin = "";
      $scope.agen = "";
      $scope.headsales = "";
      $scope.manager = "";
  } else {
      $scope.hide = true;
      var getUser = MembersFactory.getUser($stateParams.userId);
      $scope.inEditMode = true;
      $scope.user = getUser;
      $scope.item = {'photo': $scope.user.picture};
      if ($scope.user.gender === "female"  || $scope.user.gender === "Perempuan") {
        $scope.trigfemale();
      } else if ($scope.user.gender === "male" || $scope.user.gender === "Laki-laki") {
        $scope.trigmale();
      }
      if ($scope.user.level === "Admin") {
        $scope.trigadmin();
      } else if ($scope.user.level === "Masyarakat") {
        $scope.trigagen();
      } else if ($scope.user.level === "Pejabat") {
        $scope.trigheadsales();
      } else if ($scope.user.level === "Kepala Daerah") {
        $scope.trigmanager();
      }
  }

  $scope.takepic = function() {
    
    var filesSelected = document.getElementById("nameImg").files;
    if (filesSelected.length > 0) {
      var fileToLoad = filesSelected[0];
      var fileReader = new FileReader();
      fileReader.onload = function(fileLoadedEvent) {
        var textAreaFileContents = document.getElementById(
          "textAreaFileContents"
        );
        $scope.item = {
          photo: fileLoadedEvent.target.result
        };
        PickTransactionServices.updatePhoto($scope.item.photo);
        $ionicPopup.alert({title: 'Upload Success', template: 'Upload from camera success'});
        $scope.uploaded();
      };
      fileReader.readAsDataURL(fileToLoad);
    }
  };

  $scope.uploaded = function () {
    $scope.item = { photo: PickTransactionServices.photoSelected };
  };

  $scope.createMember = function (user) {
      var email = user.email;
      var password = user.password;
      var filesSelected = document.getElementById("nameImg").files;
      if (filesSelected.length > 0) {
        var fileToLoad = filesSelected[0];
        var fileReader = new FileReader();
        fileReader.onload = function(fileLoadedEvent) {
          var textAreaFileContents = document.getElementById(
            "textAreaFileContents"
          );
          $scope.item = {
            photo: fileLoadedEvent.target.result
          };
          PickTransactionServices.updatePhoto($scope.item.photo);
        };

        fileReader.readAsDataURL(fileToLoad);
      }

      // Validate form data
      if (typeof user.fullname === 'undefined' || user.fullname === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'Please enter your name!'});
          return;
      }
      if (typeof user.email === 'undefined' || user.email === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'Please input correct format email, example abc@abc.com!'});
          return;
      }
      if (typeof user.password === 'undefined' || user.password === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'Please enter your password'});
          return;
      }

      if (typeof $scope.item.photo === 'undefined' || $scope.item.photo === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'Please choose profile picture'});
          return;
      }

      if ($scope.inEditMode) {
        $ionicLoading.show({
            template: '<ion-spinner icon="ios"></ion-spinner><br>Editing...'
        });
        var photo = $scope.item.photo;
        var gender = $scope.gender;
        var level = $scope.level;

        $scope.temp = {
            fullname: user.fullname,
            picture: photo,
            email: user.email,
            password: user.password,
            gender: gender,
            level: level,
            datecreated: Date.now(),
            dateupdated: Date.now()
        }

        var membersref = MembersFactory.ref();
        var newUser = membersref.child($stateParams.userId);
        newUser.update($scope.temp, function (ref) {
        });
        $ionicLoading.hide();
        $ionicHistory.goBack();


      }else {
      //PREPARE FOR DATABASE
        $ionicLoading.show({
            template: '<ion-spinner icon="ios"></ion-spinner><br>Registering...'
        });
        firebase.auth().createUserWithEmailAndPassword(user.email,user.password).catch(function(error) {
          switch (error.code) {
              case "auth/email-already-in-use":
                  $ionicLoading.hide();
                  $ionicPopup.alert({title: 'Register Failed', template: 'The email entered is already in use!'});
                  break;
              case "auth/invalid-email":
                  $ionicLoading.hide();
                  $ionicPopup.alert({title: 'Register Failed', template: 'The specified email is not a valid email!'});
                  break;
              case "auth/operation-not-allowed":
                  $ionicLoading.hide();
                  $ionicPopup.alert({title: 'Register Failed', template: 'The accounts are not enabled!'});
                  break;
              case "auth/weak-password":
                  $ionicLoading.hide();
                  $ionicPopup.alert({title: 'Register Failed', template: 'The password not strong enough!'});
                  break;
              default:
                  $ionicLoading.hide();
                  $ionicPopup.alert({title: 'Register Failed', template: 'Oops. Something went wrong!'});
          }
        }).then(function(firebaseUser) {
          $ionicLoading.hide();
          firebase.auth().signInWithEmailAndPassword(user.email,user.password).catch(function(error) {
            switch (error.code) {
                case "auth/user-disabled":
                    $ionicLoading.hide();
                    $ionicPopup.alert({title: 'Register Failed', template: 'The email has been disable!'});
                    break;
                case "auth/invalid-email":
                    $ionicLoading.hide();
                    $ionicPopup.alert({title: 'Register Failed', template: 'The specified email is not a valid email!'});
                    break;
                case "auth/user-not-found":
                    $ionicLoading.hide();
                    $ionicPopup.alert({title: 'Register Failed', template: 'The email not found!'});
                    break;
                case "auth/wrong-password":
                    $ionicLoading.hide();
                    $ionicPopup.alert({title: 'Register Failed', template: 'The password invalid!'});
                    break;
                default:
                    $ionicLoading.hide();
                    $ionicPopup.alert({title: 'Register Failed', template: 'Oops. Something went wrong!'});
            }
          }).then(function(firebaseUser) {
            /* PREPARE DATA FOR FIREBASE*/
            var photo = $scope.item.photo;
            var gender = $scope.gender;
            var level = $scope.level;
            $scope.temp = {
                fullname: user.fullname,
                picture: photo,
                email: user.email,
                password: user.password,
                gender: gender,
                level: level,
                datecreated: Date.now(),
                dateupdated: Date.now()
            }

            /* SAVE MEMBER DATA */
            var membersref = MembersFactory.ref();
            var newUser = membersref.child(firebaseUser.uid);
            newUser.update($scope.temp, function (ref) {
            addImage = newUser.child("images");
            });
            MembersFactory.getMember(firebaseUser).then(function (thisuser) {
              /* Save user data for later use */
              myCache.put('thisUserName', thisuser.fullname);
              myCache.put('thisMemberId', firebaseUser.uid);
              CurrentUserService.updateUser(thisuser);
            });

            $ionicLoading.hide();
            $ionicHistory.goBack();
          });
        });
      }
  };
})

.controller('daftarCtrl', function($scope, $state, $ionicLoading, MembersFactory, CurrentUserService, PickTransactionServices, $ionicPopup, myCache, $stateParams, $ionicHistory) {

  $scope.$on('$ionicView.beforeEnter', function () {
    if ($scope.user.picture === ""){
       $scope.item.photo = PickTransactionServices.photoSelected;
    } else {
      $scope.item = {'photo': $scope.user.picture};
    }
  });

  $scope.user = {'fullname': '','email': '','picture': '','gender': ''};
  $scope.item = {'photo': '', 'picture':''};
  $scope.male = "";
  $scope.female = "";
  $scope.admin = "";
  $scope.agen = "";
  $scope.headsales = "";
  $scope.manager = "";

  // Gender
  $scope.trigmale = function() {
    $scope.male = "checked";
    $scope.female = "";
    $scope.gender = "male";
  };
  $scope.trigfemale = function() {
    $scope.male = "";
    $scope.female = "checked";
    $scope.gender = "female";
  };

  // User Level
  
  $scope.trigadmin = function() {
    $scope.admin = "checked";
    $scope.agen = "";
    $scope.headsales = "";
    $scope.manager = "";
    $scope.level = "Admin";
  };
  $scope.trigagen = function() {
    $scope.admin = "";
    $scope.agen = "checked";
    $scope.headsales = "";
    $scope.manager = "";
    $scope.level = "Masyarakat";
  };
  $scope.trigheadsales = function() {
    $scope.admin = "";
    $scope.agen = "";
    $scope.headsales = "checked";
    $scope.manager = "";
    $scope.level = "Pejabat";
  };
  $scope.trigmanager = function() {
    $scope.admin = "";
    $scope.agen = "";
    $scope.headsales = "";
    $scope.manager = "checked";
    $scope.level = "Kepala Daerah";
  };

  $scope.takepic = function() {
    
    var filesSelected = document.getElementById("nameImg").files;
    if (filesSelected.length > 0) {
      var fileToLoad = filesSelected[0];
      var fileReader = new FileReader();
      fileReader.onload = function(fileLoadedEvent) {
        var textAreaFileContents = document.getElementById(
          "textAreaFileContents"
        );
        $scope.item = {
          photo: fileLoadedEvent.target.result
        };
        PickTransactionServices.updatePhoto($scope.item.photo);
        $ionicPopup.alert({title: 'Upload Success', template: 'Upload from camera success'});
        $scope.uploaded();
      };
      fileReader.readAsDataURL(fileToLoad);
    }
  };

  $scope.uploaded = function () {
    $scope.item = { photo: PickTransactionServices.photoSelected };
  };

  $scope.createMember = function (user) {
      var email = user.email;
      var password = user.password;
      var filesSelected = document.getElementById("nameImg").files;
      if (filesSelected.length > 0) {
        var fileToLoad = filesSelected[0];
        var fileReader = new FileReader();
        fileReader.onload = function(fileLoadedEvent) {
          var textAreaFileContents = document.getElementById(
            "textAreaFileContents"
          );
          $scope.item = {
            photo: fileLoadedEvent.target.result
          };
          PickTransactionServices.updatePhoto($scope.item.photo);
        };

        fileReader.readAsDataURL(fileToLoad);
      }

      // Validate form data
      if (typeof user.nik === 'undefined' || user.nik === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'NIK belum diisi'});
          return;
      }

      if (typeof user.fullname === 'undefined' || user.fullname === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'Nama Lengkap belum diisi'});
          return;
      }
      if (typeof user.email === 'undefined' || user.email === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'Format email belum benar, contoh yang benar abc@abc.com!'});
          return;
      }
      if (typeof user.password === 'undefined' || user.password === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'Password belum diisi'});
          return;
      }

      if (typeof $scope.item.photo === 'undefined' || $scope.item.photo === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'Foto belum diisi'});
          return;
      }

      if ($scope.inEditMode) {
        $ionicLoading.show({
            template: '<ion-spinner icon="ios"></ion-spinner><br>Editing...'
        });
        var photo = $scope.item.photo;
        var gender = $scope.gender;
        var level = 'Masyarakat';

        $scope.temp = {
            nik: user.nik,
            fullname: user.fullname,
            picture: photo,
            email: user.email,
            password: user.password,
            gender: gender,
            level: level,
            datecreated: Date.now(),
            dateupdated: Date.now()
        }

        var membersref = MembersFactory.ref();
        var newUser = membersref.child($stateParams.userId);
        newUser.update($scope.temp, function (ref) {
        });
        $ionicLoading.hide();
        $ionicHistory.goBack();

      }else {
      //PREPARE FOR DATABASE
        $ionicLoading.show({
            template: '<ion-spinner icon="ios"></ion-spinner><br>Registering...'
        });
      firebase.auth().createUserWithEmailAndPassword(user.email,user.password).catch(function(error) {
        switch (error.code) {
            case "auth/email-already-in-use":
                $ionicLoading.hide();
                $ionicPopup.alert({title: 'Register Failed', template: 'The email entered is already in use!'});
                break;
            case "auth/invalid-email":
                $ionicLoading.hide();
                $ionicPopup.alert({title: 'Register Failed', template: 'The specified email is not a valid email!'});
                break;
            case "auth/operation-not-allowed":
                $ionicLoading.hide();
                $ionicPopup.alert({title: 'Register Failed', template: 'The accounts are not enabled!'});
                break;
            case "auth/weak-password":
                $ionicLoading.hide();
                $ionicPopup.alert({title: 'Register Failed', template: 'The password not strong enough!'});
                break;
            default:
                $ionicLoading.hide();
                $ionicPopup.alert({title: 'Register Failed', template: 'Oops. Something went wrong!'});
        }
      }).then(function(firebaseUser) {
        $ionicLoading.hide();
        firebase.auth().signInWithEmailAndPassword(user.email,user.password).catch(function(error) {
          switch (error.code) {
              case "auth/user-disabled":
                  $ionicLoading.hide();
                  $ionicPopup.alert({title: 'Register Failed', template: 'The email has been disable!'});
                  break;
              case "auth/invalid-email":
                  $ionicLoading.hide();
                  $ionicPopup.alert({title: 'Register Failed', template: 'The specified email is not a valid email!'});
                  break;
              case "auth/user-not-found":
                  $ionicLoading.hide();
                  $ionicPopup.alert({title: 'Register Failed', template: 'The email not found!'});
                  break;
              case "auth/wrong-password":
                  $ionicLoading.hide();
                  $ionicPopup.alert({title: 'Register Failed', template: 'The password invalid!'});
                  break;
              default:
                  $ionicLoading.hide();
                  $ionicPopup.alert({title: 'Register Failed', template: 'Oops. Something went wrong!'});
          }
        }).then(function(firebaseUser) {
          /* PREPARE DATA FOR FIREBASE*/
          var photo = $scope.item.photo;
          var gender = $scope.gender;
          var level = 'Masyarakat';

          $scope.temp = {
              nik: user.nik,
              fullname: user.fullname,
              picture: photo,
              email: user.email,
              password: user.password,
              gender: gender,
              level: level,
              datecreated: Date.now(),
              dateupdated: Date.now()
          }

          /* SAVE MEMBER DATA */
          var membersref = MembersFactory.ref();
          var newUser = membersref.child(firebaseUser.uid);
          newUser.update($scope.temp, function (ref) {
          addImage = newUser.child("images");
          });
          MembersFactory.getMember(firebaseUser).then(function (thisuser) {
            /* Save user data for later use */
            myCache.put('thisUserName', thisuser.fullname);
            myCache.put('thisUserLevel', thisuser.level);
            myCache.put('thisMemberId', firebaseUser.uid);
            CurrentUserService.updateUser(thisuser);
            $ionicLoading.hide();
            $state.go('app.dashboard', { memberId: firebaseUser.uid, level: thisuser.level });
          });
        });
      });
    }
  };
})

.controller("userCtrl", function($scope, $state, $rootScope, MembersFactory, $ionicLoading, $ionicPopup, CurrentUserService) {
  $scope.users = [];
  $scope.users = MembersFactory.getUsers();
  $scope.users.$loaded().then(function (x) {
    refresh($scope.users, $scope, MembersFactory);
  }).catch(function (error) {
      console.error("Error:", error);
  });

  $scope.edit = function(item) {
    $state.go('app.registration', { userId: item.$id });
  };

  $scope.verify = function(item){
    if (typeof item.$id === 'undefined' || item.$id === '') {
        $scope.hideValidationMessage = false;
        $scope.validationMessage = "No Data"
        return;
    }

    else{

      $ionicLoading.show({
          template: '<ion-spinner icon="ios"></ion-spinner><br>Verifing...'
      });
      firebase.auth().signOut();
      firebase.auth().signInWithEmailAndPassword(item.email,item.password).catch(function(error) {
          switch (error.code) {
              case "auth/user-disabled":
                  $ionicLoading.hide();
                  $ionicPopup.alert({title: 'Register Failed', template: 'The email has been disable!'});
                  break;
              case "auth/invalid-email":
                  $ionicLoading.hide();
                  $ionicPopup.alert({title: 'Register Failed', template: 'The specified email is not a valid email!'});
                  break;
              case "auth/user-not-found":
                  $ionicLoading.hide();
                  $ionicPopup.alert({title: 'Register Failed', template: 'The email not found!'});
                  break;
              case "auth/wrong-password":
                  $ionicLoading.hide();
                  $ionicPopup.alert({title: 'Register Failed', template: 'The password invalid!'});
                  break;
              default:
                  $ionicLoading.hide();
                  $ionicPopup.alert({title: 'Register Failed', template: 'Oops. Something went wrong!'});
          }
        });
      var user = firebase.auth().currentUser;
      $ionicPopup.alert({title: 'Verify Success', template: 'Ready to Delete '+user.email});
      $scope.temp = {
              $id: item.$id,
              isVerif: true
                  }
      angular.forEach($scope.users, function (data) {
        if (user.email == data.email) {
          if (data.$id == item.$id) {
              data.isVerif = true;
          }
        }
          
      })
      
      
      $ionicLoading.hide();
    }
  };

  $scope.delete = function(item){
    if (typeof item.$id === 'undefined' || item.$id === '') {
        $scope.hideValidationMessage = false;
        $scope.validationMessage = "No Data"
        return;
    }

    else{

      $ionicLoading.show({
          template: '<ion-spinner icon="ios"></ion-spinner><br>Deleting...'
      });
      var user = firebase.auth().currentUser;
      user.delete().then(function() {
        $ionicPopup.alert({title: 'Delete Success', template: 'User has been deleted'});
      }).catch(function(error) {
        $ionicPopup.alert({title: 'Delete Error', template: error});
      });
      var ref = MembersFactory.ref();
      var dRef = ref.child(item.$id);
      dRef.remove();
      $scope.email = CurrentUserService.email;
      $scope.password = CurrentUserService.password;
      firebase.auth().signInWithEmailAndPassword($scope.email,$scope.password).catch(function(error) {
        switch (error.code) {
            case "auth/user-disabled":
                $ionicLoading.hide();
                $ionicPopup.alert({title: 'Login Failed', template: 'The email has been disable!'});
                break;
            case "auth/invalid-email":
                $ionicLoading.hide();
                $ionicPopup.alert({title: 'Login Failed', template: 'The specified email is not a valid email!'});
                break;
            case "auth/user-not-found":
                $ionicLoading.hide();
                $ionicPopup.alert({title: 'Login Failed', template: 'The email not found!'});
                break;
            case "auth/wrong-password":
                $ionicLoading.hide();
                $ionicPopup.alert({title: 'Login Failed', template: 'The password invalid!'});
                break;
            default:
                $ionicLoading.hide();
                $ionicPopup.alert({title: 'Login Failed', template: 'Oops. Something went wrong!'});
        }
      });
      
      $ionicLoading.hide();
    }
  };

  function refresh(users, $scope, MembersFactory) {
  }
})

.controller("pejabatCtrl", function($scope, $state, $rootScope, MembersFactory, $ionicLoading, $ionicPopup, CurrentUserService) {
  

  $scope.$on('$ionicView.beforeEnter', function () {
    $scope.users = [];
    $scope.users = MembersFactory.getPejabats();   
    $scope.users.$loaded().then(function (x) {
      
    }).catch(function (error) {
        console.error("Error:", error);
    });
  });

  $scope.edit = function(item) {
    $state.go('app.kelola', { userId: item.$id });
  };

  $scope.calAktif = function(data) {
    $scope.aktif = 0;
    $scope.selesai = 0;
    angular.forEach(data.tanggaps, function (tanggap) {
        //
        if (tanggap.$id !== '') {
            $scope.aktif = $scope.aktif + 1;
        }
        if (tanggap.statusPengaduan === 'Done') {
            $scope.selesai = $scope.selesai + 1;
        }
    })
    data.keaktifan = $scope.aktif;
    data.penyelesaian = $scope.selesai;
    var persen = parseFloat(data.penyelesaian) / parseFloat(data.keaktifan);
    data.persen = persen.toFixed(2);
    if (persen > 0.5) {
        data.status = "Teladan";
    }else if (persen <= 0.5) {
        data.status = "Kurang Teladan";
    }else {
        data.status = " Tidak Teladan";
    }
  };

  function refresh(users, $scope, MembersFactory) {
  }
})

.controller('kelolaCtrl', function($scope, $state, $ionicLoading, $http, $stateParams, $timeout, $ionicHistory, ContactsFactory, MembersFactory, CurrentUserService, PickTransactionServices, $ionicPopup, myCache) {

  $scope.$on('$ionicView.beforeEnter', function () {
    $scope.userid = $stateParams.userId;
    ContactsFactory.getUser($scope.userid).then(function(snap) {
      $scope.user = snap;
      $scope.item = {'photo': $scope.user.picture};
      
      if ($scope.user.pangkat !== '') {
        $scope.isPangkat = true;
      }
      if ($scope.user.jabatan !== '') {
        $scope.isJabatan = true;
      }
      if ($scope.user.agama !== '') {
        $scope.isAgama = true;
      }
      if ($scope.user.perkawinan !== '') {
        $scope.isKawin = true;
      }
      if ($scope.user.gender !== '') {
        $scope.isGender = true;
      }
    })
    $scope.pendidikans = [];
    $scope.pekerjaans = [];
    $scope.jasas = [];
    $scope.keluargas = [];
    $scope.organisasis = [];
    $scope.pendidikans = ContactsFactory.getPendidikans($scope.userid);
    $scope.pekerjaans = ContactsFactory.getPekerjaans($scope.userid);
    $scope.jasas = ContactsFactory.getJasas($scope.userid);
    $scope.keluargas = ContactsFactory.getKeluargas($scope.userid);
    $scope.organisasis = ContactsFactory.getOrganisasis($scope.userid);
    
    $timeout(function () {
        $http.get('data/agama.json')
            .success(function (data) {
                for (var snap = 0; snap < data.length; snap++) {
                    $scope.features.push(data[snap]);
                }
            });
        $http.get('data/pangkat.json')
            .success(function (data) {
                for (var snap = 0; snap < data.length; snap++) {
                    $scope.pangkats.push(data[snap]);
                }
            });
        $http.get('data/jabatan.json')
            .success(function (data) {
                for (var snap = 0; snap < data.length; snap++) {
                    $scope.jabatans.push(data[snap]);
                }
            });
        $http.get('data/agama.json')
            .success(function (data) {
                for (var snap = 0; snap < data.length; snap++) {
                    $scope.agamas.push(data[snap]);
                }
            });
        $http.get('data/kelamin.json')
            .success(function (data) {
                for (var snap = 0; snap < data.length; snap++) {
                    $scope.kelamins.push(data[snap]);
                }
            });
        $http.get('data/perkawinan.json')
            .success(function (data) {
                for (var snap = 0; snap < data.length; snap++) {
                    $scope.perkawinans.push(data[snap]);
                }
            });
    }, 2000);    
  });

  $scope.features = [];
  $scope.pangkats = [];
  $scope.jabatans = [];
  $scope.agamas = [];
  $scope.kelamins = [];
  $scope.perkawinans = [];



  $scope.editJabatan = function (data) {
    if (data) {
      $scope.datajabat = [];
      $scope.isJabatan = false;
    }
  }

  $scope.changeJabatan = function (data) {
    if (data) {
      $scope.user.jabatan = data.title;
      $scope.isJabatan = true;
    }
  }

  $scope.editPangkat = function (data) {
    if (data) {
      $scope.datapangkat = [];
      $scope.isPangkat = false;
    }
  }

  $scope.changePangkat = function (data) {
    if (data) {
      $scope.user.pangkat = data.title;
      $scope.isPangkat = true;
    }
  }

  $scope.editAgama = function (data) {
    if (data) {
      $scope.dataagama = [];
      $scope.isAgama = false;
    }
  }

  $scope.changeAgama = function (data) {
    if (data) {
      $scope.user.agama = data.title;
      $scope.isAgama = true;
    }
  }

  $scope.editGender = function (data) {
    if (data) {
      $scope.datagender = [];
      $scope.isGender = false;
    }
  }

  $scope.changeGender = function (data) {
    if (data) {
      $scope.user.gender = data.title;
      $scope.isGender = true;
    }
  }

  $scope.editKawin = function (data) {
    if (data) {
      $scope.dataperkawinan = [];
      $scope.isKawin = false;
    }
  }

  $scope.changeKawin = function (data) {
    if (data) {
      $scope.user.perkawinan = data.title;
      $scope.isKawin = true;
    }
  }

  $scope.edit = function (data) {
    if (data) {
      data.isEdit = true;
    }
  }

  $scope.addedu = function () {
    $scope.pendidikans.push({"jenjang" : "", "lembaga" : "", "tahun" : "", "isEdit" : true })
  }

  $scope.saveedu = function (pendidikan) {
      
      // Validate form data
      if (typeof pendidikan.jenjang === 'undefined' || pendidikan.jenjang === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Save Pendidikan failed', template: 'Jenjang belum diisi'});
          return;
      }

      if (typeof pendidikan.lembaga === 'undefined' || pendidikan.lembaga === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Save Pendidikan failed', template: 'Lembaga belum diisi'});
          return;
      }
      if (typeof pendidikan.tahun === 'undefined' || pendidikan.tahun === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Save Pendidikan failed', template: 'Tahun belum diisi'});
          return;
      }

      $ionicLoading.show({
          template: '<ion-spinner icon="ios"></ion-spinner><br>Save Pendidikan...'
      });

      $scope.temp = {
          jenjang: pendidikan.jenjang,
          lembaga: pendidikan.lembaga,
          tahun: pendidikan.tahun,
          idEdit: false,
          createdBy: $scope.userid,
          datecreated: Date.now(),
          dateupdated: Date.now()
      }

      if (typeof pendidikan.$id === 'undefined' || pendidikan.$id === '') {
        var membersref = MembersFactory.ref();
        var newRef = membersref.child($scope.userid).child("pendidikans");
        newRef.push($scope.temp);
      } else {
        var membersref = MembersFactory.ref();
        var newRef = membersref.child($scope.userid).child("pendidikans").child(pendidikan.$id);
        newRef.update($scope.temp);
      }
      
      $ionicLoading.hide();
      $ionicPopup.alert({title: 'Update Success', template: 'Menyimpan Riwayat Pendidikan berhasil'});
      $state.reload();
  };

  $scope.addjob = function () {
    $scope.pekerjaans.push({"jabatan" : "", "sk" : "", "waktu" : "", "keterangan" : "", "isEdit" : true })
  }

  $scope.savejob = function (pekerjaan) {
      
      // Validate form data
      if (typeof pekerjaan.jabatan === 'undefined' || pekerjaan.jabatan === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Save Pekerjaan failed', template: 'Nama Jabatan belum diisi'});
          return;
      }

      if (typeof pekerjaan.sk === 'undefined' || pekerjaan.sk === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Save Pekerjaan failed', template: 'No SK belum diisi'});
          return;
      }
      if (typeof pekerjaan.waktu === 'undefined' || pekerjaan.waktu === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Save Pekerjaan failed', template: 'Waktu belum diisi'});
          return;
      }
      if (typeof pekerjaan.keterangan === 'undefined' || pekerjaan.keterangan === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Save Pekerjaan failed', template: 'Keterangan Pekerjaan belum diisi'});
          return;
      }

      $ionicLoading.show({
          template: '<ion-spinner icon="ios"></ion-spinner><br>Save Pekerjaan...'
      });

      $scope.temp = {
          jabatan: pekerjaan.jabatan,
          sk: pekerjaan.sk,
          waktu: pekerjaan.waktu,
          keterangan: pekerjaan.keterangan,
          idEdit: false,
          createdBy: $scope.userid,
          datecreated: Date.now(),
          dateupdated: Date.now()
      }

      if (typeof pekerjaan.$id === 'undefined' || pekerjaan.$id === '') {
        var membersref = MembersFactory.ref();
        var newRef = membersref.child($scope.userid).child("pekerjaans");
        newRef.push($scope.temp);
      } else {
        var membersref = MembersFactory.ref();
        var newRef = membersref.child($scope.userid).child("pekerjaans").child(pekerjaan.$id);
        newRef.update($scope.temp);
      }
      
      $ionicLoading.hide();
      $ionicPopup.alert({title: 'Update Success', template: 'Menyimpan Riwayat Pekerjaan berhasil'});
      $state.reload();
  };

  $scope.addjasa = function () {
    $scope.jasas.push({"penghargaan" : "", "tahun" : "", "pemberi" : "", "isEdit" : true })
  }

  $scope.savejasa = function (jasa) {
      
      // Validate form data
      if (typeof jasa.penghargaan === 'undefined' || jasa.penghargaan === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Save Penghargaan failed', template: 'Penghargaan belum diisi'});
          return;
      }

      if (typeof jasa.tahun === 'undefined' || jasa.tahun === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Save Penghargaan failed', template: 'Tahun belum diisi'});
          return;
      }
      if (typeof jasa.pemberi === 'undefined' || jasa.pemberi === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Save Penghargaan failed', template: 'Waktu belum diisi'});
          return;
      }

      $ionicLoading.show({
          template: '<ion-spinner icon="ios"></ion-spinner><br>Save Penghargaan...'
      });

      $scope.temp = {
          penghargaan: jasa.penghargaan,
          tahun: jasa.tahun,
          pemberi: jasa.pemberi,
          idEdit: false,
          createdBy: $scope.userid,
          datecreated: Date.now(),
          dateupdated: Date.now()
      }

      if (typeof jasa.$id === 'undefined' || jasa.$id === '') {
        var membersref = MembersFactory.ref();
        var newRef = membersref.child($scope.userid).child("jasas");
        newRef.push($scope.temp);
      } else {
        var membersref = MembersFactory.ref();
        var newRef = membersref.child($scope.userid).child("jasas").child(jasa.$id);
        newRef.update($scope.temp);
      }
      
      $ionicLoading.hide();
      $ionicPopup.alert({title: 'Update Success', template: 'Menyimpan Riwayat Penghargaan berhasil'});
      $state.reload();
  };

  $scope.addkeluarga = function () {
    $scope.keluargas.push({"nama" : "", "hubungan" : "", "ttl" : "", "keterangan" : "", "isEdit" : true })
  }

  $scope.savekeluarga = function (keluarga) {
      
      // Validate form data
      if (typeof keluarga.nama === 'undefined' || keluarga.nama === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Save Keluarga failed', template: 'Nama belum diisi'});
          return;
      }

      if (typeof keluarga.hubungan === 'undefined' || keluarga.hubungan === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Save Keluarga failed', template: 'Hubungan belum diisi'});
          return;
      }
      if (typeof keluarga.ttl === 'undefined' || keluarga.ttl === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Save Keluarga failed', template: 'Tempat Tanggal Lahir belum diisi'});
          return;
      }
      if (typeof keluarga.pekerjaan === 'undefined' || keluarga.pekerjaan === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Save Keluarga failed', template: 'Pekerjaan belum diisi'});
          return;
      }
      if (typeof keluarga.keterangan === 'undefined' || keluarga.keterangan === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Save Keluarga failed', template: 'Keterangan Keluarga belum diisi'});
          return;
      }

      $ionicLoading.show({
          template: '<ion-spinner icon="ios"></ion-spinner><br>Save Keluarga...'
      });

      $scope.temp = {
          nama: keluarga.nama,
          hubungan: keluarga.hubungan,
          ttl: keluarga.ttl,
          pekerjaan: keluarga.pekerjaan,
          keterangan: keluarga.keterangan,
          idEdit: false,
          createdBy: $scope.userid,
          datecreated: Date.now(),
          dateupdated: Date.now()
      }

      if (typeof keluarga.$id === 'undefined' || keluarga.$id === '') {
        var membersref = MembersFactory.ref();
        var newRef = membersref.child($scope.userid).child("keluargas");
        newRef.push($scope.temp);
      } else {
        var membersref = MembersFactory.ref();
        var newRef = membersref.child($scope.userid).child("keluargas").child(keluarga.$id);
        newRef.update($scope.temp);
      }
      
      $ionicLoading.hide();
      $ionicPopup.alert({title: 'Update Success', template: 'Menyimpan Riwayat Keluarga berhasil'});
      $state.reload();
  };

  $scope.addorganisasi = function () {
    $scope.organisasis.push({"nama" : "", "jabatan" : "", "periode" : "", "isEdit" : true })
  }

  $scope.saveorganisasi = function (organisasi) {
      
      // Validate form data
      if (typeof organisasi.nama === 'undefined' || organisasi.nama === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Save Organisasi failed', template: 'Nama Organisasi belum diisi'});
          return;
      }

      if (typeof organisasi.jabatan === 'undefined' || organisasi.jabatan === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Save Organisasi failed', template: 'Jabatan belum diisi'});
          return;
      }
      if (typeof organisasi.periode === 'undefined' || organisasi.periode === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Save Organisasi failed', template: 'Periode belum diisi'});
          return;
      }

      $ionicLoading.show({
          template: '<ion-spinner icon="ios"></ion-spinner><br>Save Organisasi...'
      });

      $scope.temp = {
          nama: organisasi.nama,
          jabatan: organisasi.jabatan,
          periode: organisasi.periode,
          idEdit: false,
          createdBy: $scope.userid,
          datecreated: Date.now(),
          dateupdated: Date.now()
      }

      if (typeof organisasi.$id === 'undefined' || organisasi.$id === '') {
        var membersref = MembersFactory.ref();
        var newRef = membersref.child($scope.userid).child("organisasis");
        newRef.push($scope.temp);
      } else {
        var membersref = MembersFactory.ref();
        var newRef = membersref.child($scope.userid).child("organisasis").child(organisasi.$id);
        newRef.update($scope.temp);
      }
      
      $ionicLoading.hide();
      $ionicPopup.alert({title: 'Update Success', template: 'Menyimpan Riwayat Organisasi berhasil'});
      $state.reload();
  };
  
  // Gender
  $scope.trigmale = function() {
    $scope.male = "checked";
    $scope.female = "";
    $scope.gender = "male";
  };
  $scope.trigfemale = function() {
    $scope.male = "";
    $scope.female = "checked";
    $scope.gender = "female";
  };

  $scope.takepic = function() {
    
    var filesSelected = document.getElementById("nameImg").files;
    if (filesSelected.length > 0) {
      var fileToLoad = filesSelected[0];
      var fileReader = new FileReader();
      fileReader.onload = function(fileLoadedEvent) {
        var textAreaFileContents = document.getElementById(
          "textAreaFileContents"
        );
        $scope.item = {
          photo: fileLoadedEvent.target.result
        };
        PickTransactionServices.updatePhoto($scope.item.photo);
        $ionicPopup.alert({title: 'Upload Success', template: 'Upload from camera success'});
        $scope.uploaded();
      };
      fileReader.readAsDataURL(fileToLoad);
    }
  };

  $scope.uploaded = function () {
    $scope.item = { photo: PickTransactionServices.photoSelected };
  };

  $scope.createMember = function (user) {
      var email = user.email;
      var password = user.password;
      var filesSelected = document.getElementById("nameImg").files;
      if (filesSelected.length > 0) {
        var fileToLoad = filesSelected[0];
        var fileReader = new FileReader();
        fileReader.onload = function(fileLoadedEvent) {
          var textAreaFileContents = document.getElementById(
            "textAreaFileContents"
          );
          $scope.item = {
            photo: fileLoadedEvent.target.result
          };
          PickTransactionServices.updatePhoto($scope.item.photo);
        };

        fileReader.readAsDataURL(fileToLoad);
      }

      // Validate form data

      if (typeof user.fullname === 'undefined' || user.fullname === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'Nama Lengkap belum diisi'});
          return;
      }

      if (typeof user.jabatan === 'undefined' || user.jabatan === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'Jabatan belum dipilih'});
          return;
      }

      if (typeof user.nik === 'undefined' || user.nik === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'NIK belum diisi'});
          return;
      }
      
      if (typeof user.nip === 'undefined' || user.nip === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'NIP belum diisi'});
          return;
      }
      if (typeof user.npwp === 'undefined' || user.npwp === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'NPWP belum diisi'});
          return;
      }

      if (typeof user.pangkat === 'undefined' || user.pangkat === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'Pangkat belum dipilih'});
          return;
      }

      if (typeof user.ttl === 'undefined' || user.ttl === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'Tempat Tanggal Lahir belum diisi'});
          return;
      }
      if (typeof user.agama === 'undefined' || user.agama === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'Agama belum dipilih'});
          return;
      }
      if (typeof user.gender === 'undefined' || user.gender === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'Jenis Kelamin belum dipilih'});
          return;
      }

      if (typeof user.perkawinan === 'undefined' || user.perkawinan === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'Status Perkawinan belum dipilih'});
          return;
      }

      if (typeof user.rumah === 'undefined' || user.rumah === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'Alamat rumah belum diisi'});
          return;
      }
      if (typeof user.email === 'undefined' || user.email === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'Format email belum benar, contoh yang benar abc@abc.com!'});
          return;
      }
      if (typeof user.telrumah === 'undefined' || user.telrumah === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'Telepon Rumah belum diisi'});
          return;
      }

      if (typeof user.telhp === 'undefined' || user.telhp === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'Telepon seluler belum diisi'});
          return;
      }

      if (typeof user.kantor === 'undefined' || user.kantor === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'Alamat kantor belum diisi'});
          return;
      }
      if (typeof user.telkantor === 'undefined' || user.telkantor === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'Telepon kantor belum diisi'});
          return;
      }

      if (typeof $scope.item.photo === 'undefined' || $scope.item.photo === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'Foto belum diisi'});
          return;
      }

      $ionicLoading.show({
          template: '<ion-spinner icon="ios"></ion-spinner><br>Updating...'
      });

      var photo = $scope.item.photo;

      

      $scope.temp = {
          nip: user.nip,
          npwp: user.npwp,
          pangkat: user.pangkat,
          ttl: user.ttl,
          jabatan: user.jabatan,
          agama: user.agama,
          perkawinan: user.perkawinan,
          rumah: user.rumah,
          telrumah: user.telrumah,
          telhp: user.telhp,
          kantor: user.kantor,
          telkantor: user.telkantor,
          nik: user.nik,
          fullname: user.fullname,
          picture: photo,
          email: user.email,
          gender: user.gender,
          createdBy: $scope.userid,
          dateupdated: Date.now()
      }

      var membersref = MembersFactory.ref();
      var newUser = membersref.child($scope.userid);
      newUser.update($scope.temp);      

      $ionicLoading.hide();
      $ionicPopup.alert({title: 'Update Success', template: 'Update Daftar Riwyat Hidup Success'});
      $ionicHistory.goBack();
      
  };
})

.controller('tanggapanCtrl', function($scope, $state, $ionicLoading, MembersFactory, $ionicPopup, myCache) {

  $scope.adus = [];
  $scope.adus = MembersFactory.getPengaduans();
  $scope.adus.$loaded().then(function (x) {
    angular.forEach($scope.adus, function (data) {
      if (data.$id !== '') {
        if (data.statusPengaduan == "Baru") {
            data.classBtn = "btn btn-danger btn-xs";
        }
        if (data.statusPengaduan == "On Progress") {
            data.classBtn = "btn btn-warning btn-xs";
        }
        if (data.statusPengaduan == "Done") {
            data.classBtn = "btn btn-success btn-xs";
        }
      }
    })
  }).catch(function (error) {
      console.error("Error:", error);
  });
  
  $scope.$on('$ionicView.beforeEnter', function () {
    $scope.adus.$loaded().then(function (x) {
      angular.forEach($scope.adus, function (data) {
        if (data.$id !== '') {
          if (data.statusPengaduan == "Baru") {
              data.classBtn = "btn btn-danger btn-xs";
          }
          if (data.statusPengaduan == "On Progress") {
              data.classBtn = "btn btn-warning btn-xs";
          }
          if (data.statusPengaduan == "Done") {
              data.classBtn = "btn btn-success btn-xs";
          }
        }
      })
    })
  });

  $scope.edit = function(item) {
    $state.go('app.addtanggapan', { tanggapanId: item.$id });
  };

  function refresh(adus, $scope, MembersFactory) {
    
  }
})

.controller('tanggapansCtrl', function($scope, $state, $ionicLoading, MembersFactory, $ionicPopup, myCache) {

  $scope.adus = [];
  $scope.adus = MembersFactory.getTanggapans($scope.userid);
  $scope.adus.$loaded().then(function (x) {
    angular.forEach($scope.adus, function (data) {
      if (data.$id !== '') {
        if (data.statusPengaduan == "Baru") {
            data.classBtn = "btn btn-danger btn-xs";
        }
        if (data.statusPengaduan == "On Progress") {
            data.classBtn = "btn btn-warning btn-xs";
        }
        if (data.statusPengaduan == "Done") {
            data.classBtn = "btn btn-success btn-xs";
        }
      }
    })
  }).catch(function (error) {
      console.error("Error:", error);
  });
  
  $scope.$on('$ionicView.beforeEnter', function () {
    $scope.userid = myCache.get('thisMemberId');
    $scope.adus.$loaded().then(function (x) {
      angular.forEach($scope.adus, function (data) {
        if (data.$id !== '') {
          if (data.statusPengaduan == "Baru") {
              data.classBtn = "btn btn-danger btn-xs";
          }
          if (data.statusPengaduan == "On Progress") {
              data.classBtn = "btn btn-warning btn-xs";
          }
          if (data.statusPengaduan == "Done") {
              data.classBtn = "btn btn-success btn-xs";
          }
        }
      })
    })
  });

  $scope.edit = function(item) {
    $state.go('app.addtanggapan', { tanggapanId: item.$id });
  };

  function refresh(adus, $scope, MembersFactory) {
    
  }
})

.controller('addtanggapanCtrl', function($scope, $ionicLoading, $filter, $ionicModal, MembersFactory, CustomerFactory, $cordovaGeolocation, $stateParams, PickTransactionServices, CurrentUserService, $ionicPopup, myCache, $ionicHistory) {

  var getPengaduan = MembersFactory.getPengaduan($stateParams.tanggapanId);
  $scope.pengaduan = getPengaduan;
  $scope.item = {'photo': $scope.pengaduan.picture};

  $scope.$on('$ionicView.beforeEnter', function () {
    $scope.photo = CurrentUserService.picture;
    $scope.fullname = CurrentUserService.fullname;
    $scope.level = CurrentUserService.level;
    $scope.userid = myCache.get('thisMemberId');
    $scope.dateTanggapan = $filter("date")(Date.now(), 'yyyy-MM-dd');
  });

  // Gender
  $scope.progress = "";
  $scope.done = "";
  $scope.trigprogress = function() {
    $scope.progress = "checked";
    $scope.done = "";
    $scope.status = "On Progress";
  };
  $scope.trigdone = function() {
    $scope.progress = "";
    $scope.done = "checked";
    $scope.status = "Done";
  };

  $scope.takepic = function() {
    
    var filesSelected = document.getElementById("nameImg").files;
    if (filesSelected.length > 0) {
      var fileToLoad = filesSelected[0];
      var fileReader = new FileReader();
      fileReader.onload = function(fileLoadedEvent) {
        var textAreaFileContents = document.getElementById(
          "textAreaFileContents"
        );
        $scope.item = {
          photo: fileLoadedEvent.target.result
        };
        PickTransactionServices.updatePhoto($scope.item.photo);
        $scope.uploaded();
      };
      fileReader.readAsDataURL(fileToLoad);
    }
  };

  $scope.uploaded = function () {
    $scope.item = { photo: PickTransactionServices.photoSelected };
  };

  $scope.addTanggapan = function (pengaduan) {

      var filesSelected = document.getElementById("nameImg").files;
      if (filesSelected.length > 0) {
        var fileToLoad = filesSelected[0];
        var fileReader = new FileReader();
        fileReader.onload = function(fileLoadedEvent) {
          var textAreaFileContents = document.getElementById(
            "textAreaFileContents"
          );
          $scope.item = {
            photo: fileLoadedEvent.target.result
          };
          PickTransactionServices.updatePhoto($scope.item.photo);
        };

        fileReader.readAsDataURL(fileToLoad);
      }

      // Validate form data
      if (typeof pengaduan.tindakPengaduan === 'undefined' || pengaduan.tindakPengaduan === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Tanggapan failed', template: 'Tindakan belum diisi!'});
          return;
      }
      if (typeof pengaduan.laporanPengaduan === 'undefined' || pengaduan.laporanPengaduan === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Tanggapan failed', template: 'Laporan belum diisi!'});
          return;
      }

      if (typeof $scope.item.photo === 'undefined' || $scope.item.photo === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Tanggapan failed', template: 'Foto bukti tanggapan belum dilampirkan'});
          return;
      }

      
      //PREPARE FOR DATABASE
        $ionicLoading.show({
            template: '<ion-spinner icon="ios"></ion-spinner><br>Processing...'
        });
        /* PREPARE DATA FOR FIREBASE*/
        var photo = $scope.item.photo;
        var picTanggapan = $scope.fullname;
        var idPicTanggapan = $scope.userid;
        var statusPengaduan = $scope.status;
        $scope.temp = {
            locationPengaduan: pengaduan.locationPengaduan,
            latPengaduan: pengaduan.latPengaduan,
            lngPengaduan: pengaduan.lngPengaduan,
            locDetailPengaduan: pengaduan.locDetailPengaduan,
            komentarPengaduan: pengaduan.komentarPengaduan,
            picture: pengaduan.picture,
            datePengaduan: pengaduan.datePengaduan,
            picPengaduan: pengaduan.picPengaduan,
            idPicPengaduan: pengaduan.idPicPengaduan,
            tindakPengaduan: pengaduan.tindakPengaduan,
            laporanPengaduan: pengaduan.laporanPengaduan,
            pictureTanggapan: photo,
            dateTanggapan: $scope.dateTanggapan,
            statusPengaduan: statusPengaduan,
            picTanggapan: picTanggapan,
            idPicTanggapan: idPicTanggapan,
            dateupdated: Date.now()
        }

        /* SAVE MEMBER DATA */
        var pengref = MembersFactory.pRef();
        var newAdu = pengref.child($stateParams.tanggapanId);
        newAdu.update($scope.temp);
        
        var membersref = MembersFactory.ref();
        var newUser = membersref.child(pengaduan.idPicPengaduan).child("adus").child($stateParams.tanggapanId);
        newUser.update($scope.temp);
        var newTanggap = membersref.child($scope.userid).child("tanggaps").child($stateParams.tanggapanId);
        newTanggap.update($scope.temp);

        $ionicLoading.hide();
        $scope.modal.hide();
        $ionicPopup.alert({title: 'Input Success', template: 'Input tanggapan berhasil'});
        $ionicHistory.goBack();
  };

  function refresh(customer, $scope, temp) {

    $scope.customer = {'name': '','address': '' ,'email': '' ,'phone': '' ,'gender': ''};
  }
})

.controller('profileCtrl', function($scope, $state, $ionicLoading, $ionicHistory, ContactsFactory, MembersFactory, CurrentUserService, PickTransactionServices, $ionicPopup, myCache) {

  $scope.$on('$ionicView.beforeEnter', function () {
    $scope.userid = myCache.get('thisMemberId');
    ContactsFactory.getUser($scope.userid).then(function(snap) {
      $scope.user = snap;
      $scope.item = {'photo': $scope.user.picture};
      if ($scope.user.gender === "female") {
        $scope.trigfemale();
      } else if ($scope.user.gender === "male") {
        $scope.trigmale();
      }
    })    
  });
  
  // Gender
  $scope.trigmale = function() {
    $scope.male = "checked";
    $scope.female = "";
    $scope.gender = "male";
  };
  $scope.trigfemale = function() {
    $scope.male = "";
    $scope.female = "checked";
    $scope.gender = "female";
  };

  $scope.takepic = function() {
    
    var filesSelected = document.getElementById("nameImg").files;
    if (filesSelected.length > 0) {
      var fileToLoad = filesSelected[0];
      var fileReader = new FileReader();
      fileReader.onload = function(fileLoadedEvent) {
        var textAreaFileContents = document.getElementById(
          "textAreaFileContents"
        );
        $scope.item = {
          photo: fileLoadedEvent.target.result
        };
        PickTransactionServices.updatePhoto($scope.item.photo);
        $ionicPopup.alert({title: 'Upload Success', template: 'Upload from camera success'});
        $scope.uploaded();
      };
      fileReader.readAsDataURL(fileToLoad);
    }
  };

  $scope.uploaded = function () {
    $scope.item = { photo: PickTransactionServices.photoSelected };
  };

  $scope.createMember = function (user) {
      var email = user.email;
      var password = user.password;
      var filesSelected = document.getElementById("nameImg").files;
      if (filesSelected.length > 0) {
        var fileToLoad = filesSelected[0];
        var fileReader = new FileReader();
        fileReader.onload = function(fileLoadedEvent) {
          var textAreaFileContents = document.getElementById(
            "textAreaFileContents"
          );
          $scope.item = {
            photo: fileLoadedEvent.target.result
          };
          PickTransactionServices.updatePhoto($scope.item.photo);
        };

        fileReader.readAsDataURL(fileToLoad);
      }

      // Validate form data
      if (typeof user.nik === 'undefined' || user.nik === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'NIK belum diisi'});
          return;
      }

      if (typeof user.fullname === 'undefined' || user.fullname === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'Nama Lengkap belum diisi'});
          return;
      }
      if (typeof user.email === 'undefined' || user.email === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'Format email belum benar, contoh yang benar abc@abc.com!'});
          return;
      }
      if (typeof user.password === 'undefined' || user.password === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'Password belum diisi'});
          return;
      }

      if (typeof $scope.item.photo === 'undefined' || $scope.item.photo === '') {
          $scope.hideValidationMessage = false;
          $ionicPopup.alert({title: 'Registration failed', template: 'Foto belum diisi'});
          return;
      }

      $ionicLoading.show({
          template: '<ion-spinner icon="ios"></ion-spinner><br>Editing...'
      });
      var photo = $scope.item.photo;
      var gender = $scope.gender;
      var level = $scope.level;

      $scope.temp = {
          nik: user.nik,
          fullname: user.fullname,
          picture: photo,
          email: user.email,
          password: user.password,
          gender: gender,
          level: level,
          datecreated: Date.now(),
          dateupdated: Date.now()
      }

      var ubah = firebase.auth().currentUser;

      ubah.updateEmail(user.email).then(function() {
        // Update successful.
      }).catch(function(error) {
        // An error happened.
      });

      var membersref = MembersFactory.ref();
      var newUser = membersref.child($scope.userid);
      newUser.update($scope.temp, function (ref) {
      });
      $ionicLoading.hide();
      $ionicPopup.alert({title: 'Update Success', template: 'Update Profile Success'});
      $ionicHistory.nextViewOptions({
          disableAnimate: true,
          disableBack: true
      });
      $state.go('app.dashboard', { memberId: $scope.userid, level: level });
  };
})

.controller('detprofileCtrl', function($scope, $state, $stateParams, $ionicLoading, $ionicHistory, ContactsFactory, MasterFactory, CurrentUserService, PickTransactionServices, $ionicPopup, myCache) {

  $scope.profile = {'title': '','desc': '','picture': ''};
  $scope.item = {'photo': '','picture': ''};
  $scope.inEditMode = false;
  $scope.informations = MasterFactory.getInformations();
  $scope.informations.$loaded().then(function (x) {
    refresh($scope.informations, $scope, MasterFactory);
  }).catch(function (error) {
      console.error("Error:", error);
  });
  $scope.features = MasterFactory.getFeatures();
  $scope.features.$loaded().then(function (x) {
    refresh($scope.features, $scope, MasterFactory);
  }).catch(function (error) {
      console.error("Error:", error);
  });

  if ($stateParams.profileId === '') {
      //
      // Create Material
      //
      $scope.infos = [];
      $scope.tests = [];
      $scope.skills = [];
      $scope.item = {'photo': '','picture': ''};
      $scope.addinfos = function () {
          $scope.infos.push({})
      }
      $scope.addtags = function () {
          $scope.tests.push({})
      }
      $scope.addfeats = function () {
          $scope.skills.push({})
      }
      angular.forEach($scope.infos, function (info) {
          if (info.info !== "") {
            MasterFactory.getInfo(info.info).then(function(data){
              info.sel = false;
              info.isi = {$id: info.info, value: info.value, title: info.title, icon: info.icon};
            })
          }
      })
      $scope.editin = function (data) {
        angular.forEach($scope.infos, function (info) {
            if (info.info === data) {
              info.sel = true;
            }
        })
      }
      $scope.chanin = function (data) {
        angular.forEach($scope.infos, function (info) {
            if (info.info === data) {
              if (info.isi.$id === data){
                info.sel = false;
              }
            }
        })
      }
      angular.forEach($scope.skills, function (feat) {
          if (feat.feature !== "") {
            MasterFactory.getFeat(feat.feature).then(function(data){
              feat.sel = false;
              feat.isi = {$id: feat.feature, title: feat.title, icon: feat.icon};
            })
          }
      })
      $scope.editfeat = function (data) {
        angular.forEach($scope.skills, function (feat) {
            if (feat.feature === data) {
              feat.sel = true;
            }
        })
      }
      $scope.chanfeat = function (data) {
        angular.forEach($scope.skills, function (feat) {
            if (feat.feature === data) {
              if (feat.isi.$id === data){
                feat.sel = false;
              }
            }
        })
      }
  } else {
      //
      // Edit Material
      //
      var getprofile = ContactsFactory.getUser($stateParams.profileId);
      $scope.inEditMode = true;
      $scope.profile = getprofile;
      $scope.infos = getprofile.infos;
      if ($scope.infos === undefined) {
        $scope.infos = [];
      }
      angular.forEach($scope.infos, function (info) {
          if (info.info !== "") {
            MasterFactory.getInfo(info.info).then(function(data){
              info.sel = false;
              info.isi = {$id: info.info, value: info.value, title: info.title, icon: info.icon};
            })
          }
      })
      $scope.editin = function (data) {
        angular.forEach($scope.infos, function (info) {
            if (info.info === data) {
              info.sel = true;
            }
        })
      }
      $scope.chanin = function (data) {
        angular.forEach($scope.infos, function (info) {
            if (info.info === data) {
              if (info.isi.$id === data){
                info.sel = false;
              }
            }
        })
      }
      $scope.tests = getprofile.testimonis;
      if ($scope.tests === undefined) {
        $scope.tests = [];
      }
      $scope.skills = getprofile.skills;
      if ($scope.skills === undefined) {
        $scope.skills = [];
      }
      angular.forEach($scope.skills, function (feat) {
          if (feat.feature !== "") {
            MasterFactory.getFeat(feat.feature).then(function(data){
              feat.sel = false;
              feat.isi = {$id: feat.feature, title: feat.title, icon: feat.icon};
            })
          }
      })
      $scope.editfeat = function (data) {
        angular.forEach($scope.skills, function (feat) {
            if (feat.feature === data) {
              feat.sel = true;
            }
        })
      }
      $scope.chanfeat = function (data) {
        angular.forEach($scope.skills, function (feat) {
            if (feat.feature === data) {
              if (feat.isi.$id === data){
                feat.sel = false;
              }
            }
        })
      }
      $scope.item = {'photo': $scope.profile.picture};
      $scope.addinfos = function () {
          $scope.infos.push({})
      }
      $scope.addtags = function () {
          $scope.tests.push({})
      }
      $scope.addfeats = function () {
          $scope.skills.push({})
      }
  }

  $scope.$on('$ionicView.beforeEnter', function () {
    $scope.profile = getprofile;
    $scope.item = {'photo': $scope.profile.picture, 'picture':''};
  });

  $scope.takepic = function() {
    
    var filesSelected = document.getElementById("nameImg").files;
    if (filesSelected.length > 0) {
      var fileToLoad = filesSelected[0];
      var fileReader = new FileReader();
      fileReader.onload = function(fileLoadedEvent) {
        var textAreaFileContents = document.getElementById(
          "textAreaFileContents"
        );
        $scope.item = {
          photo: fileLoadedEvent.target.result
        };
        PickTransactionServices.updatePhoto($scope.item.photo);
      };

      fileReader.readAsDataURL(fileToLoad);
    }
  };

  $scope.takepict = function(data) {
    
    var filesSelected = document.getElementById("0").files;
    if (filesSelected.length > 0) {
      var fileToLoad = filesSelected[0];
      var fileReader = new FileReader();
      fileReader.onload = function(fileLoadedEvent) {
        var textAreaFileContents = document.getElementById(
          "textAreaFileContents"
        );
        $scope.item = {
          picture: fileLoadedEvent.target.result
        };
        $scope.tests.fill({picture: $scope.item.picture});
      };

      fileReader.readAsDataURL(fileToLoad);
    }
  };

  $scope.createProfile = function (profile,informations,tests,skills) {
      var filesSelected = document.getElementById("nameImg").files;
      if (filesSelected.length > 0) {
        var fileToLoad = filesSelected[0];
        var fileReader = new FileReader();
        fileReader.onload = function(fileLoadedEvent) {
          var textAreaFileContents = document.getElementById(
            "textAreaFileContents"
          );
          $scope.item = {
            photo: fileLoadedEvent.target.result
          };
        };

        fileReader.readAsDataURL(fileToLoad);
      }

      // Validate form data
      if (typeof profile.name === 'undefined' || profile.name === '') {
          $scope.hideValidationMessage = false;
          $scope.validationMessage = "Please enter name"
          return;
      }
      if (typeof profile.desc === 'undefined' || profile.desc === '') {
          $scope.hideValidationMessage = false;
          $scope.validationMessage = "Please enter desc"
          return;
      }

      $ionicLoading.show({
          template: '<ion-spinner icon="ios"></ion-spinner><br>Adding...'
      });

      if ($stateParams.profileId === '') {

        /* PREPARE DATA FOR FIREBASE*/
        var photo = $scope.item.photo;
        $scope.temp = {
            name: profile.name,
            picture: photo,
            desc: profile.desc,
            addedby: CurrentUserService.fullname,
            datecreated: Date.now(),
            dateupdated: Date.now()
        }

        /* SAVE OVERVIEW DATA */
        var ref = ContactsFactory.eRef();
        var newChildRef = ref.push($scope.temp);
        $scope.idpr = newChildRef.key;
        $scope.datai = [];
        $scope.datat = [];
        $scope.dataf = [];
        /* SAVE INFO DATA */
        angular.forEach(informations, function (information) {
            if (information.isi.$id !== undefined) {
                $scope.data = {
                    info: information.isi.$id,
                    title: information.isi.title,
                    value: information.value,
                    icon: information.isi.icon
                }
                $scope.datai.push($scope.data);
            }
        })
        angular.forEach(tests, function (testi) {
            if (testi.name !== '') {
                $scope.data = {
                    name: testi.name,
                    title: testi.title,
                    company: testi.company,
                    desc: testi.desc,
                    picture: testi.picture
                }
                $scope.datat.push($scope.data);
            }
        })
        angular.forEach(skills, function (featur) {
            if (featur.isi.$id !== undefined) {
                $scope.data = {
                    feature: featur.isi.$id,
                    title: featur.isi.title,
                    icon: featur.isi.icon
                }
                $scope.dataf.push($scope.data);
            }
        })

        var infoRef = ref.child($scope.idpr).child("infos");
        infoRef.set($scope.datai);

        var tagRef = ref.child($scope.idpr).child("testimonis");
        tagRef.set($scope.datat);

        var featRef = ref.child($scope.idpr).child("skills");
        featRef.set($scope.dataf);

        $ionicLoading.hide();
        refresh($scope.profile, $scope);
        $ionicHistory.goBack();

      } else {

        /* PREPARE DATA FOR FIREBASE*/
        var photo = $scope.item.photo;
        $scope.temp = {
            name: profile.name,
            picture: photo,
            desc: profile.desc,
            addedby: CurrentUserService.fullname,
            datecreated: Date.now(),
            dateupdated: Date.now()
        }

        /* SAVE OVERVIEW DATA */
        var ref = ContactsFactory.eRef();
        var childRef = ref.child($stateParams.profileId);
        childRef.set($scope.temp);
        $scope.datai = [];
        $scope.datat = [];
        $scope.dataf = [];
        /* SAVE INFO DATA */
        angular.forEach(informations, function (information) {
            if (information.isi.$id !== undefined) {
                $scope.data = {
                    info: information.isi.$id,
                    title: information.isi.title,
                    value: information.value,
                    icon: information.isi.icon
                }
                $scope.datai.push($scope.data);
            }
        })
        angular.forEach(tests, function (testi) {
            if (testi.name !== '') {
                $scope.data = {
                    name: testi.name,
                    title: testi.title,
                    company: testi.company,
                    desc: testi.desc,
                    picture: testi.picture
                }
                $scope.datat.push($scope.data);
            }
        })
        angular.forEach(skills, function (featur) {
            if (featur.isi.$id !== undefined) {
                $scope.data = {
                    feature: featur.isi.$id,
                    title: featur.isi.title,
                    icon: featur.isi.icon
                }
                $scope.dataf.push($scope.data);
            }
        })

        var infoRef = ref.child($stateParams.profileId).child("infos");
        infoRef.set($scope.datai);

        var tagRef = ref.child($stateParams.profileId).child("testimonis");
        tagRef.set($scope.datat);

        var featRef = ref.child($stateParams.profileId).child("skills");
        featRef.set($scope.dataf);

        $ionicLoading.hide();
        refresh($scope.profile, $scope);
        $ionicHistory.goBack();
    }
  };

  function refresh(temp, profile, $scope, item) {
  }
})

.controller('loginCtrl', function($scope, $rootScope, $stateParams, $ionicHistory, $cacheFactory, $ionicLoading, $ionicPopup, $state, MembersFactory, myCache, CurrentUserService) {

  $scope.user = {};

  $scope.doLogIn = function (user) {
      $ionicLoading.show({
          template: '<ion-spinner icon="ios"></ion-spinner><br>Loggin In...'
      });

      /* Check user fields*/
      if (!user.email || !user.password) {
          $ionicLoading.hide();
          $ionicPopup.alert({title: 'Login Failed', template: 'Please check your Email or Password!'});
          return;
      }

      /* Authenticate User */
      firebase.auth().signInWithEmailAndPassword(user.email,user.password).catch(function(error) {
        switch (error.code) {
            case "auth/user-disabled":
                $ionicLoading.hide();
                $ionicPopup.alert({title: 'Login Failed', template: 'The email has been disable!'});
                break;
            case "auth/invalid-email":
                $ionicLoading.hide();
                $ionicPopup.alert({title: 'Login Failed', template: 'The specified email is not a valid email!'});
                break;
            case "auth/user-not-found":
                $ionicLoading.hide();
                $ionicPopup.alert({title: 'Login Failed', template: 'The email not found!'});
                break;
            case "auth/wrong-password":
                $ionicLoading.hide();
                $ionicPopup.alert({title: 'Login Failed', template: 'The password invalid!'});
                break;
            default:
                $ionicLoading.hide();
                $ionicPopup.alert({title: 'Login Failed', template: 'Oops. Something went wrong!'});
        }
      }).then(function(firebaseUser) {
        MembersFactory.getMember(firebaseUser).then(function (thisuser) {
                  
            /* Save user data for later use */
            myCache.put('thisUserName', thisuser.fullname);
            myCache.put('thisUserLevel', thisuser.level);
            myCache.put('thisMemberId', firebaseUser.uid);
            CurrentUserService.updateUser(thisuser);
                $ionicLoading.hide();
                $state.reload('app');
                $state.go('app.dashboard', { memberId: firebaseUser.uid, level: thisuser.level });
        });
      });
  }
})

.controller('pengaduanCtrl', function($scope, $state, $ionicLoading, MembersFactory, $ionicPopup, myCache) {

  $scope.adus = [];
  $scope.adus = MembersFactory.getPengaduans();
  $scope.adus.$loaded().then(function (x) {
    angular.forEach($scope.adus, function (data) {
      if (data.$id !== '') {
        if (data.statusPengaduan == "Baru") {
            data.classBtn = "btn btn-danger btn-xs";
        }
        if (data.statusPengaduan == "On Progress") {
            data.classBtn = "btn btn-warning btn-xs";
        }
        if (data.statusPengaduan == "Done") {
            data.classBtn = "btn btn-success btn-xs";
        }
      }
    })
  }).catch(function (error) {
      console.error("Error:", error);
  });

  $scope.$on('$ionicView.beforeEnter', function () {
    $scope.adus.$loaded().then(function (x) {
      angular.forEach($scope.adus, function (data) {
        if (data.$id !== '') {
          if (data.statusPengaduan == "Baru") {
              data.classBtn = "btn btn-danger btn-xs";
          }
          if (data.statusPengaduan == "On Progress") {
              data.classBtn = "btn btn-warning btn-xs";
          }
          if (data.statusPengaduan == "Done") {
              data.classBtn = "btn btn-success btn-xs";
          }
        }
      })
    })
  });
  

  $scope.edit = function(item) {
    $state.go('app.addtanggapan', { tanggapanId: item.$id });
  };

  function refresh(adus, $scope, MembersFactory) {
    
  }
})

.controller('addpengaduanCtrl', function($scope, $ionicLoading, $ionicModal, CustomerFactory, $cordovaGeolocation, $stateParams, CurrentUserService, $ionicPopup, myCache, $ionicHistory) {

  $scope.customer = {'name': '','address': '' ,'email': '' ,'phone': '' ,'gender': ''};
  

  $scope.$on('$ionicView.beforeEnter', function () {
    $scope.photo = CurrentUserService.picture;
    $scope.fullname = CurrentUserService.fullname;
  });

  var options = {timeout: 10000, enableHighAccuracy: true};
 

  // Gender
  $scope.male = "";
  $scope.female = "";
  $scope.trigmale = function() {
    $scope.male = "checked";
    $scope.female = "";
    $scope.gender = "Pria";
  };
  $scope.trigfemale = function() {
    $scope.male = "";
    $scope.female = "checked";
    $scope.gender = "Wanita";
  };

  function refresh(customer, $scope, temp) {

    $scope.customer = {'name': '','address': '' ,'email': '' ,'phone': '' ,'gender': ''};
  }
})

.controller('assigncustomerCtrl', function($scope, $ionicLoading, CustomerFactory, $stateParams, CurrentUserService, MembersFactory, $ionicPopup, myCache, $ionicHistory) {

  var getcust = CustomerFactory.getCustomer($stateParams.customerId);
  $scope.inEditMode = true;
  $scope.customer = getcust;
  if ($scope.customer.assignto !== "" || $scope.customer.assignto !== undefined) {
    $scope.tampil = false;
  }
  $scope.agens = MembersFactory.getAgens();
  $scope.agens.$loaded().then(function (x) {
    refresh($scope.agens, $scope, MembersFactory);
  }).catch(function (error) {
      console.error("Error:", error);
  });

  $scope.changedValue = function(item){
    $scope.itemList.push(item.fullname);

  } 

  $scope.createCustomer = function (customer) {

      // Validate form data
      if (typeof customer.firstName === 'undefined' || customer.firstName === '') {
          $scope.hideValidationMessage = false;
          $scope.validationMessage = "Please enter name"
          return;
      }
      if (typeof customer.telephone === 'undefined' || customer.telephone === '') {
          $scope.hideValidationMessage = false;
          $scope.validationMessage = "Please enter phone number"
          return;
      }
      $ionicLoading.show({
          template: '<ion-spinner icon="ios"></ion-spinner><br>Assigning...'
      });
      /* PREPARE DATA FOR FIREBASE*/
      $scope.temp = {
          assignto: customer.assignto,
          addedby: myCache.get('thisMemberId'),
          dateupdated: Date.now(),
          isEnable: false
      }
      /* SAVE PRODUCT DATA */
      var newCustomer = CustomerFactory.ref();
      var newData = newCustomer.child($stateParams.customerId);
      newData.update($scope.temp, function (ref) {
      });
      $ionicLoading.hide();
      $ionicHistory.goBack();
      
      refresh($scope.customer, $scope);
  };

  function refresh(agen, $scope, temp) {

  }
})

.controller('taskCtrl', function($scope, $state, $ionicLoading, CustomerFactory, $ionicPopup, myCache) {

  $scope.tasks = [];
  $scope.tasks = CustomerFactory.pRef();
  $scope.tasks.$loaded().then(function (x) {
    refresh($scope.customer, $scope, CustomerFactory);
  }).catch(function (error) {
      console.error("Error:", error);
  });

  $scope.$on('$ionicView.beforeEnter', function () {
    refresh($scope.informations, $scope);
  });


  function refresh(informations, $scope, item) {
  }
})

.controller("agenCtrl", function($scope, $state, $rootScope, MembersFactory, $ionicLoading) {
  $scope.users = [];
  $scope.users = MembersFactory.getUsers();
  $scope.users.$loaded().then(function (x) {
    refresh($scope.users, $scope, MembersFactory);
  }).catch(function (error) {
      console.error("Error:", error);
  });

  $scope.edit = function(item) {
    $state.go('app.registration', { userId: item.$id });
  };

  function refresh(users, $scope, MembersFactory) {
    
  }
})

;


