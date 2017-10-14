angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, CurrentUserService, TransactionFactory, myCache) {

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

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  $scope.fullname = CurrentUserService.fullname;
  $scope.photo = CurrentUserService.picture;
  $scope.level = CurrentUserService.level;
  $scope.userid = myCache.get('thisMemberId');

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

.controller('dashboardCtrl', function($scope, CurrentUserService, myCache, TransactionFactory, ContactsFactory, AccountsFactory, MasterFactory, $compile) {

  $scope.fullname = CurrentUserService.fullname;
  $scope.photo = CurrentUserService.picture;
  $scope.level = CurrentUserService.level;
  $scope.userid = myCache.get('thisMemberId');
  $scope.reads = 0;
  $scope.shares = 0;
  $scope.access = 0;
  $scope.comment = 0;
  $scope.notify = 0;
  $scope.posting = 0;
  
  

  $scope.doRefresh = function (){
    $scope.reads = 0;
    $scope.shares = 0;
    $scope.access = 0;
    $scope.comments = 0;
    $scope.notify = 0;
    $scope.posting = 0;

    $scope.emails = [];
    $scope.emails = TransactionFactory.getEmails();
    $scope.emails.$loaded().then(function (x) {
      var notif = 0;
      var index;
      //
      for (index = 0; index < $scope.emails.length; ++index) {
          //
          var mail = $scope.emails[index];
          //
          if (mail.open === false) {
              notif = notif + 1;
          }
      }
      $scope.notify = notif;
      refresh($scope.emails, $scope, TransactionFactory);
    }).catch(function (error) {
        console.error("Error:", error);
    });

    $scope.blogs = [];
    $scope.blogs = TransactionFactory.getBlogs();
    $scope.blogs.$loaded().then(function (x) {
      $scope.posting = $scope.blogs.length;     
      var index;
      //
      angular.forEach($scope.blogs, function (blog) {
          if (blog.reads !== undefined) {
            var total = $scope.reads;
            angular.forEach(blog.reads, function () {
              total++;
            })
            $scope.reads = total; 
          }
          
          if (blog.comments !== undefined) {
            var total = $scope.comments;
            angular.forEach(blog.comments, function () {
              total++;
            })
            $scope.comments = total; 
          }
          
          if (blog.shares !== undefined) {
            var total = $scope.shares;
            angular.forEach(blog.shares, function () {
              total++;
            }) 
            $scope.shares = total;
          }
          
      })
      refresh($scope.blogs, $scope, TransactionFactory);
    }).catch(function (error) {
        console.error("Error:", error);
    });

    
    $scope.overviews = TransactionFactory.getAccess();
    $scope.overviews.$loaded().then(function (x) {
      $scope.access = $scope.overviews.length;
      refresh($scope.overviews, $scope, TransactionFactory);
    }).catch(function (error) {
        console.error("Error:", error);
    });

    $scope.users = AccountsFactory.getUsers();
    $scope.users.$loaded().then(function (x) {
      var juser = 0;
      var index;
      //
      for (index = 0; index < $scope.users.length; ++index) {
          juser++;
      }
      $scope.jumlahuser = juser;
      $scope.$broadcast('scroll.refreshComplete');
    }).catch(function (error) {
        console.error("Error:", error);
    });

  };

  $scope.users = AccountsFactory.getUsers();
  $scope.users.$loaded().then(function (x) {
    $scope.doRefresh();
  }).catch(function (error) {
      console.error("Error:", error);
  });

  $scope.$on('$ionicView.beforeEnter', function () {
    refresh($scope.blogs, $scope.emails, $scope.overviews, $scope.users, $scope);
  });

      
      



  function refresh(blogs, emails, overviews, users, $scope, item) {
    
  }
})

.controller('registrationCtrl', function($scope, $state, $ionicLoading, MembersFactory, CurrentUserService, PickTransactionServices, $ionicPopup, myCache, $stateParams, $ionicHistory) {

  $scope.user = {'fullname': '','email': '','picture': '','gender': ''};
  $scope.item = {'photo': ''};


  $scope.$on('$ionicView.beforeEnter', function () {
    if ($scope.user.picture === ""){
       $scope.item.photo = PickTransactionServices.photoSelected;
    } else {
      $scope.item = {'photo': $scope.user.picture};
    }
  });

  // Gender
  $scope.male = "";
  $scope.female = "";
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
  $scope.admin = "";
  $scope.agen = "";
  $scope.headsales = "";
  $scope.manager = "";
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
    $scope.level = "Agen";
  };
  $scope.trigheadsales = function() {
    $scope.admin = "";
    $scope.agen = "";
    $scope.headsales = "checked";
    $scope.manager = "";
    $scope.level = "Kepala Penjualan";
  };
  $scope.trigmanager = function() {
    $scope.admin = "";
    $scope.agen = "";
    $scope.headsales = "";
    $scope.manager = "checked";
    $scope.level = "Manajer";
  };

  if ($stateParams.userId === '') {
      //
      // Create user
      //
      $scope.item = {'photo': '', 'picture':''};
  } else {
      //
      // Edit Product
      //

      var getUser = MembersFactory.getUser($stateParams.userId);
      $scope.inEditMode = true;
      $scope.user = getUser;
      $scope.item = {'photo': $scope.user.picture};
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
      };

      fileReader.readAsDataURL(fileToLoad);
    }
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
            gender: gender,
            level: level,
            datecreated: Date.now(),
            dateupdated: Date.now()
        }

        MembersFactory.saveUser($scope.temp, function (ref) {
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

.controller('productCtrl', function($scope, $state, $ionicLoading, MasterFactory, $ionicPopup, myCache) {

  $scope.products = [];

  $scope.products = MasterFactory.getProducts();
  $scope.products.$loaded().then(function (x) {
    refresh($scope.products, $scope, MasterFactory);
  }).catch(function (error) {
      console.error("Error:", error);
  });

  $scope.$on('$ionicView.beforeEnter', function () {
    refresh($scope.products, $scope);
  });

  $scope.edit = function(item) {
    $state.go('app.addproduct', { productId: item.$id });
  };

  function refresh(products, $scope, item) {
  }
})

.controller('addproductCtrl', function($scope, $state, $stateParams, $ionicHistory, $ionicLoading, MasterFactory, CurrentUserService, PickTransactionServices, $ionicPopup, myCache) {

  $scope.product = {'nama': '','stok': '','harga': '','photo': '','picture': ''};
  $scope.item = {'photo': ''};
  $scope.inEditMode = false;

  $scope.$on('$ionicView.beforeEnter', function () {
    if ($scope.product.picture === ""){
       $scope.item.photo = PickTransactionServices.photoSelected;
    } else {
      $scope.item = {'photo': $scope.product.picture};
    }
  });

  if ($stateParams.productId === '') {
      //
      // Create Product
      //
      $scope.item = {'photo': ''};
  } else {
      //
      // Edit Product
      //
      var getproduct = MasterFactory.getProduct($stateParams.productId);
      $scope.inEditMode = true;
      $scope.product = getproduct;
      $scope.item = {'photo': $scope.product.picture};
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
        $scope.product.photo = fileLoadedEvent.target.result;
        PickTransactionServices.updatePhoto($scope.item.photo);
      };

      fileReader.readAsDataURL(fileToLoad);
    }
  };

  $scope.createProduct = function (product) {
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
      if (typeof product.nama === 'undefined' || product.nama === '') {
          $scope.hideValidationMessage = false;
          $scope.validationMessage = "Please enter nama"
          return;
      }
      if (typeof product.stok === 'undefined' || product.stok === '') {
          $scope.hideValidationMessage = false;
          $scope.validationMessage = "Please enter stok"
          return;
      }
      if (typeof product.harga === 'undefined' || product.harga === '') {
          $scope.hideValidationMessage = false;
          $scope.validationMessage = "Please enter harga"
          return;
      }

      if ($scope.inEditMode) {
        $ionicLoading.show({
            template: '<ion-spinner icon="ios"></ion-spinner><br>Editing...'
        });
        /* PREPARE DATA FOR FIREBASE*/
        var photo = $scope.item.photo;
        $scope.temp = {
            nama: product.nama,
            picture: photo,
            harga: product.harga,
            stok: product.stok,
            addedby: CurrentUserService.fullname,
            datecreated: Date.now(),
            dateupdated: Date.now()
        }
        /* SAVE PRODUCT DATA */
        var productref = MasterFactory.pRef();
        var newData = productref.child($stateParams.productId);
        newData.update($scope.temp, function (ref) {
        });
        $ionicHistory.goBack();
      }
      else {
        $ionicLoading.show({
            template: '<ion-spinner icon="ios"></ion-spinner><br>Adding...'
        });
        /* PREPARE DATA FOR FIREBASE*/
        var photo = $scope.item.photo;
        $scope.temp = {
            nama: product.nama,
            picture: photo,
            harga: product.harga,
            stok: product.stok,
            addedby: CurrentUserService.fullname,
            datecreated: Date.now(),
            dateupdated: Date.now()
        }
        /* SAVE PRODUCT DATA */
        var ref = MasterFactory.pRef();
        ref.push($scope.temp);
        $ionicHistory.goBack();
      }

      $ionicLoading.hide();
      refresh($scope.product, $scope);
  };

  function refresh(product, $scope, item) {

    $scope.product = {'nama': '','stok': '','harga': '','picture': ''};
    $scope.item = {'photo': ''};
  }
})

.controller('infoCtrl', function($scope, $state, $ionicLoading, MasterFactory, $ionicPopup, myCache) {

  $scope.informations = [];

  $scope.informations = MasterFactory.getInformations();
  $scope.informations.$loaded().then(function (x) {
    refresh($scope.informations, $scope, MasterFactory);
  }).catch(function (error) {
      console.error("Error:", error);
  });

  $scope.$on('$ionicView.beforeEnter', function () {
    refresh($scope.informations, $scope);
  });

  $scope.edit = function(item) {
    $state.go('app.editinfo', { informationId: item.$id });
  };

  function refresh(informations, $scope, item) {
  }
})

.controller('addinfoCtrl', function($scope, $state, $ionicLoading, MasterFactory, CurrentUserService, PickTransactionServices, $ionicPopup, myCache) {

  $scope.info = {'title': '','icon': ''};

  $scope.createInformation = function (info) {

      // Validate form data
      if (typeof info.title === 'undefined' || info.title === '') {
          $scope.hideValidationMessage = false;
          $scope.validationMessage = "Please enter title"
          return;
      }
      if (typeof info.icon === 'undefined' || info.icon === '') {
          $scope.hideValidationMessage = false;
          $scope.validationMessage = "Please enter icon"
          return;
      }

      $ionicLoading.show({
          template: '<ion-spinner icon="ios"></ion-spinner><br>Adding...'
      });

      /* PREPARE DATA FOR FIREBASE*/
      $scope.temp = {
          title: info.title,
          icon: info.icon,
          addedby: CurrentUserService.fullname,
          datecreated: Date.now(),
          dateupdated: Date.now()
      }

      /* SAVE MEMBER DATA */
      var ref = MasterFactory.miRef();
      ref.push($scope.temp);

      $ionicLoading.hide();
      refresh($scope.info, $scope);
  };

  function refresh(info, $scope, item) {

    $scope.info = {'title': '','icon': ''};
  }
})

.controller('editinfoCtrl', function($scope, $state, $stateParams, $ionicLoading, $ionicHistory, MasterFactory, CurrentUserService, PickTransactionServices, $ionicPopup, myCache) {

  $scope.information = {'title': '','icon': ''};
  $scope.inEditMode = false;
  var getinformation = MasterFactory.getInformation($stateParams.informationId);

  if ($stateParams.informationId === '') {
      //
      // Create Material
      //
  } else {
      //
      // Edit Material
      //
      var getinformation = MasterFactory.getInformation($stateParams.informationId);
      $scope.inEditMode = true;
      $scope.information = getinformation;
  }

  $scope.$on('$ionicView.beforeEnter', function () {
    $scope.information = getinformation;
  });

  $scope.editInformation = function () {

      // Validate form data
      if (typeof $scope.information.title === 'undefined' || $scope.information.title === '') {
          $scope.hideValidationMessage = false;
          $scope.validationMessage = "Please enter title"
          return;
      }
      if (typeof $scope.information.icon === 'undefined' || $scope.information.icon === '') {
          $scope.hideValidationMessage = false;
          $scope.validationMessage = "Please enter icon"
          return;
      }

      $ionicLoading.show({
          template: '<ion-spinner icon="ios"></ion-spinner><br>Editing...'
      });

      /* PREPARE DATA FOR FIREBASE*/
      $scope.temp = {
          title: $scope.information.title,
          icon: $scope.information.icon,
          addedby: CurrentUserService.fullname,
          dateupdated: Date.now()
      }

      /* SAVE MATERIAL DATA */
      var informationref = MasterFactory.miRef();
      var newData = informationref.child($stateParams.informationId);
      newData.update($scope.temp, function (ref) {
      });

      $scope.temp = {};
      $ionicLoading.hide();
      refresh($scope.information, $scope.temp, $scope);
      $ionicHistory.goBack();
  };

  function refresh(temp, information, $scope, item) {

    $scope.information = {'title': '','icon': ''};
    $scope.temp = {};
  }
})

.controller('tagCtrl', function($scope, $state, $ionicLoading, MasterFactory, $ionicPopup, myCache) {

  $scope.tags = [];

  $scope.tags = MasterFactory.getTags();
  $scope.tags.$loaded().then(function (x) {
    refresh($scope.tags, $scope, MasterFactory);
  }).catch(function (error) {
      console.error("Error:", error);
  });

  $scope.$on('$ionicView.beforeEnter', function () {
    refresh($scope.tags, $scope);
  });

  $scope.edit = function(item) {
    $state.go('app.edittag', { tagId: item.$id });
  };

  function refresh(tags, $scope, item) {
  }
})

.controller('addtagCtrl', function($scope, $state, $ionicLoading, MasterFactory, CurrentUserService, PickTransactionServices, $ionicPopup, myCache) {

  $scope.tag = {'title': ''};

  $scope.createTag = function (tag) {

      // Validate form data
      if (typeof tag.title === 'undefined' || tag.title === '') {
          $scope.hideValidationMessage = false;
          $scope.validationMessage = "Please enter title"
          return;
      }

      $ionicLoading.show({
          template: '<ion-spinner icon="ios"></ion-spinner><br>Adding...'
      });

      /* PREPARE DATA FOR FIREBASE*/
      $scope.temp = {
          title: tag.title,
          addedby: CurrentUserService.fullname,
          datecreated: Date.now(),
          dateupdated: Date.now()
      }

      /* SAVE MEMBER DATA */
      var ref = MasterFactory.mtRef();
      ref.push($scope.temp);

      $ionicLoading.hide();
      refresh($scope.tag, $scope);
  };

  function refresh(tag, $scope, item) {

    $scope.tag = {'title': ''};
  }
})

.controller('edittagCtrl', function($scope, $state, $stateParams, $ionicLoading, $ionicHistory, MasterFactory, CurrentUserService, PickTransactionServices, $ionicPopup, myCache) {

  $scope.tag = {'title': ''};
  $scope.inEditMode = false;
  var gettag = MasterFactory.getTag($stateParams.tagId);

  if ($stateParams.tagId === '') {
      //
      // Create Material
      //
  } else {
      //
      // Edit Material
      //
      var gettag = MasterFactory.getTag($stateParams.tagId);
      $scope.inEditMode = true;
      $scope.tag = gettag;
  }

  $scope.$on('$ionicView.beforeEnter', function () {
    $scope.tag = gettag;
  });

  $scope.editTag = function () {

      // Validate form data
      if (typeof $scope.tag.title === 'undefined' || $scope.tag.title === '') {
          $scope.hideValidationMessage = false;
          $scope.validationMessage = "Please enter title"
          return;
      }

      $ionicLoading.show({
          template: '<ion-spinner icon="ios"></ion-spinner><br>Editing...'
      });

      /* PREPARE DATA FOR FIREBASE*/
      $scope.temp = {
          title: $scope.tag.title,
          addedby: CurrentUserService.fullname,
          dateupdated: Date.now()
      }

      /* SAVE MATERIAL DATA */
      var tagref = MasterFactory.mtRef();
      var newData = tagref.child($stateParams.tagId);
      newData.update($scope.temp, function (ref) {
      });

      $scope.temp = {};
      $ionicLoading.hide();
      refresh($scope.tag, $scope.temp, $scope);
      $ionicHistory.goBack();
  };

  function refresh(temp, feature, $scope, item) {

    $scope.feature = {'title': ''};
    $scope.temp = {};
  }
})

.controller('featureCtrl', function($scope, $state, $ionicLoading, MasterFactory, $ionicPopup, myCache) {

  $scope.features = [];

  $scope.features = MasterFactory.getFeatures();
  $scope.features.$loaded().then(function (x) {
    refresh($scope.features, $scope, MasterFactory);
  }).catch(function (error) {
      console.error("Error:", error);
  });

  $scope.$on('$ionicView.beforeEnter', function () {
    refresh($scope.features, $scope);
  });

  $scope.edit = function(item) {
    $state.go('app.editfeature', { featureId: item.$id });
  };

  function refresh(features, $scope, item) {
  }
})

.controller('addfeatureCtrl', function($scope, $state, $ionicLoading, MasterFactory, CurrentUserService, PickTransactionServices, $ionicPopup, myCache) {

  $scope.feature = {'title': '','icon': ''};

  $scope.createFeature = function (feature) {

      // Validate form data
      if (typeof feature.title === 'undefined' || feature.title === '') {
          $scope.hideValidationMessage = false;
          $scope.validationMessage = "Please enter title"
          return;
      }
      if (typeof feature.icon === 'undefined' || feature.icon === '') {
          $scope.hideValidationMessage = false;
          $scope.validationMessage = "Please enter icon"
          return;
      }

      $ionicLoading.show({
          template: '<ion-spinner icon="ios"></ion-spinner><br>Adding...'
      });

      /* PREPARE DATA FOR FIREBASE*/
      $scope.temp = {
          title: feature.title,
          icon: feature.icon,
          addedby: CurrentUserService.fullname,
          datecreated: Date.now(),
          dateupdated: Date.now()
      }

      /* SAVE MEMBER DATA */
      var ref = MasterFactory.mfRef();
      ref.push($scope.temp);

      $ionicLoading.hide();
      refresh($scope.feature, $scope);
  };

  function refresh(feature, $scope, item) {

    $scope.feature = {'title': '','icon': ''};
  }
})

.controller('editfeatureCtrl', function($scope, $state, $stateParams, $ionicLoading, $ionicHistory, MasterFactory, CurrentUserService, PickTransactionServices, $ionicPopup, myCache) {

  $scope.feature = {'title': '','icon': ''};
  $scope.inEditMode = false;
  var getfeature = MasterFactory.getFeature($stateParams.featureId);

  if ($stateParams.featureId === '') {
      //
      // Create Material
      //
  } else {
      //
      // Edit Material
      //
      var getfeature = MasterFactory.getFeature($stateParams.featureId);
      $scope.inEditMode = true;
      $scope.feature = getfeature;
  }

  $scope.$on('$ionicView.beforeEnter', function () {
    $scope.feature = getfeature;
  });

  $scope.editFeature = function () {

      // Validate form data
      if (typeof $scope.feature.title === 'undefined' || $scope.feature.title === '') {
          $scope.hideValidationMessage = false;
          $scope.validationMessage = "Please enter title"
          return;
      }
      if (typeof $scope.feature.icon === 'undefined' || $scope.feature.icon === '') {
          $scope.hideValidationMessage = false;
          $scope.validationMessage = "Please enter icon"
          return;
      }

      $ionicLoading.show({
          template: '<ion-spinner icon="ios"></ion-spinner><br>Editing...'
      });

      /* PREPARE DATA FOR FIREBASE*/
      $scope.temp = {
          title: $scope.feature.title,
          icon: $scope.feature.icon,
          addedby: CurrentUserService.fullname,
          dateupdated: Date.now()
      }

      /* SAVE MATERIAL DATA */
      var featureref = MasterFactory.mfRef();
      var newData = featureref.child($stateParams.featureId);
      newData.update($scope.temp, function (ref) {
      });

      $scope.temp = {};
      $ionicLoading.hide();
      refresh($scope.feature, $scope.temp, $scope);
      $ionicHistory.goBack();
  };

  function refresh(temp, feature, $scope, item) {

    $scope.feature = {'title': '','icon': ''};
    $scope.temp = {};
  }
})

.controller('overviewCtrl', function($scope, $state, $ionicLoading, TransactionFactory, MasterFactory, $ionicPopup, myCache) {

  $scope.overviews = [];

  $scope.overviews = TransactionFactory.getOverviews();
  $scope.overviews.$loaded().then(function (x) {
    refresh($scope.overviews, $scope, TransactionFactory);
  }).catch(function (error) {
      console.error("Error:", error);
  });

  $scope.$on('$ionicView.beforeEnter', function () {
    refresh($scope.overviews, $scope);
  });

  $scope.edit = function(item) {
    $state.go('app.editoverview', { overviewId: item.$id });
  };

  function refresh(overviews, $scope, item) {
  }
})

.controller('addoverviewCtrl', function($scope, $state, $ionicLoading, TransactionFactory, MasterFactory, CurrentUserService, PickTransactionServices, $ionicPopup, myCache) {

  $scope.overview = {'title': '','desc': '','picture': ''};
  $scope.item = {'photo': ''};

  $scope.$on('$ionicView.beforeEnter', function () {
    $scope.item.photo = PickTransactionServices.photoSelected;
  });

  $scope.infos = [];
  $scope.addinfos = function () {
      $scope.infos.push({})
  }
  $scope.tags = [];
  $scope.addtags = function () {
      $scope.tags.push({})
  }
  $scope.feats = [];
  $scope.addfeats = function () {
      $scope.feats.push({})
  }

  $scope.informations = MasterFactory.getInformations();
  $scope.informations.$loaded().then(function (x) {
    refresh($scope.informations, $scope, MasterFactory);
  }).catch(function (error) {
      console.error("Error:", error);
  });
  $scope.tages = MasterFactory.getTags();
  $scope.tages.$loaded().then(function (x) {
    refresh($scope.tages, $scope, MasterFactory);
  }).catch(function (error) {
      console.error("Error:", error);
  });
  $scope.features = MasterFactory.getFeatures();
  $scope.features.$loaded().then(function (x) {
    refresh($scope.features, $scope, MasterFactory);
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
      };

      fileReader.readAsDataURL(fileToLoad);
    }
  };

  $scope.createOverview = function (overview,informations,tages,features) {
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
      if (typeof overview.title === 'undefined' || overview.title === '') {
          $scope.hideValidationMessage = false;
          $scope.validationMessage = "Please enter title"
          return;
      }
      if (typeof overview.desc === 'undefined' || overview.desc === '') {
          $scope.hideValidationMessage = false;
          $scope.validationMessage = "Please enter desc"
          return;
      }

      $ionicLoading.show({
          template: '<ion-spinner icon="ios"></ion-spinner><br>Adding...'
      });

      /* PREPARE DATA FOR FIREBASE*/
      var photo = $scope.item.photo;
      $scope.temp = {
          title: overview.title,
          picture: photo,
          desc: overview.desc,
          addedby: CurrentUserService.fullname,
          datecreated: Date.now(),
          dateupdated: Date.now()
      }

      /* SAVE OVERVIEW DATA */
      var ref = TransactionFactory.ovRef();
      var newChildRef = ref.push($scope.temp);
      $scope.idov = newChildRef.key;
      $scope.datai = [];
      $scope.datat = [];
      $scope.dataf = [];
      /* SAVE INFO DATA */
      angular.forEach(informations, function (information) {
          if (information.isi.$id !== "") {
              $scope.data = {
                  info: information.isi.$id,
                  title: information.isi.title,
                  value: information.value,
                  icon: information.isi.icon
              }
              $scope.datai.push($scope.data);
          }
      })
      angular.forEach(tages, function (tage) {
          if (tage.isi.$id !== "") {
              $scope.data = {
                  tag: tage.isi.$id,
                  title: tage.isi.title
              }
              $scope.datat.push($scope.data);
          }
      })
      angular.forEach(features, function (featur) {
          if (featur.isi.$id !== "") {
              $scope.data = {
                  feature: featur.isi.$id,
                  title: featur.isi.title,
                  icon: featur.isi.icon
              }
              $scope.dataf.push($scope.data);
          }
      })

      var infoRef = ref.child($scope.idov).child("infos");
      infoRef.set($scope.datai);

      var tagRef = ref.child($scope.idov).child("tags");
      tagRef.set($scope.datat);

      var featRef = ref.child($scope.idov).child("features");
      featRef.set($scope.dataf);

      var kindRef = ref.child($stateParams.overviewId);
      kindRef.update({kind: $scope.datat[0].title});

      $ionicLoading.hide();
      refresh($scope.overview, $scope);
  };

  function refresh(overview, $scope, item) {

    $scope.overview = {'title': '','desc': '','picture': ''};
    $scope.item = {'photo': ''};
    $scope.infos = [];
    $scope.tags = [];
    $scope.feats = [];
  }
})

.controller('editoverviewCtrl', function($scope, $state, $stateParams, $ionicLoading, $ionicHistory, TransactionFactory, MasterFactory, CurrentUserService, PickTransactionServices, $ionicPopup, myCache) {

  $scope.overview = {'title': '','desc': '','picture': ''};
  $scope.item = {'photo': ''};
  $scope.inEditMode = false;
  $scope.informations = MasterFactory.getInformations();
  $scope.informations.$loaded().then(function (x) {
    refresh($scope.informations, $scope, MasterFactory);
  }).catch(function (error) {
      console.error("Error:", error);
  });
  $scope.tages = MasterFactory.getTags();
  $scope.tages.$loaded().then(function (x) {
    refresh($scope.tages, $scope, MasterFactory);
  }).catch(function (error) {
      console.error("Error:", error);
  });
  $scope.features = MasterFactory.getFeatures();
  $scope.features.$loaded().then(function (x) {
    refresh($scope.features, $scope, MasterFactory);
  }).catch(function (error) {
      console.error("Error:", error);
  });

  if ($stateParams.overviewId === '') {
      //
      // Create Material
      //
      $scope.item = {'photo': ''};
  } else {
      //
      // Edit Material
      //
      var getoverview = TransactionFactory.getOverview($stateParams.overviewId);
      $scope.inEditMode = true;
      $scope.overview = getoverview;
      $scope.infos = getoverview.infos;
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
      $scope.tags = getoverview.tags;
      if ($scope.tags === undefined) {
        $scope.tags = [];
      }
      angular.forEach($scope.tags, function (tage) {
          if (tage.tag !== "") {
            MasterFactory.getTage(tage.tag).then(function(data){
              tage.sel = false;
              tage.isi = {$id: tage.tag, title: tage.title};
            })
          }
      })
      $scope.edittag = function (data) {
        angular.forEach($scope.tags, function (tag) {
            if (tag.tag === data) {
              tag.sel = true;
            }
        })
      }
      $scope.chantag = function (data) {
        angular.forEach($scope.tags, function (tag) {
            if (tag.tag === data) {
              if (tag.isi.$id === data){
                tag.sel = false;
              }
            }
        })
      }
      $scope.feats = getoverview.features;
      if ($scope.feats === undefined) {
        $scope.feats = [];
      }
      angular.forEach($scope.feats, function (feat) {
          if (feat.feature !== "") {
            MasterFactory.getFeat(feat.feature).then(function(data){
              feat.sel = false;
              feat.isi = {$id: feat.feature, title: feat.title, icon: feat.icon};
            })
          }
      })
      $scope.editfeat = function (data) {
        angular.forEach($scope.feats, function (feat) {
            if (feat.feature === data) {
              feat.sel = true;
            }
        })
      }
      $scope.chanfeat = function (data) {
        angular.forEach($scope.feats, function (feat) {
            if (feat.feature === data) {
              if (feat.isi.$id === data){
                feat.sel = false;
              }
            }
        })
      }
      $scope.item = {'photo': $scope.overview.picture};
      $scope.addinfos = function () {
          $scope.infos.push({})
      }
      $scope.addtags = function () {
          $scope.tags.push({})
      }
      $scope.addfeats = function () {
          $scope.feats.push({})
      }
  }

  $scope.$on('$ionicView.beforeEnter', function () {
    $scope.overview = getoverview;
    $scope.item = {'photo': $scope.overview.picture};
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

  $scope.editOverview = function (overview,informations,tages,features) {
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
      if (typeof overview.title === 'undefined' || overview.title === '') {
          $scope.hideValidationMessage = false;
          $scope.validationMessage = "Please enter title"
          return;
      }
      if (typeof overview.desc === 'undefined' || overview.desc === '') {
          $scope.hideValidationMessage = false;
          $scope.validationMessage = "Please enter desc"
          return;
      }

      $ionicLoading.show({
          template: '<ion-spinner icon="ios"></ion-spinner><br>Adding...'
      });

      /* PREPARE DATA FOR FIREBASE*/
      var photo = $scope.item.photo;
      $scope.temp = {
          title: overview.title,
          picture: photo,
          desc: overview.desc,
          addedby: CurrentUserService.fullname,
          datecreated: Date.now(),
          dateupdated: Date.now()
      }

      /* SAVE OVERVIEW DATA */
      var ref = TransactionFactory.ovRef();
      var childRef = ref.child($stateParams.overviewId);
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
      angular.forEach(tages, function (tage) {
          if (tage.isi.$id !== undefined) {
              $scope.data = {
                  tag: tage.isi.$id,
                  title: tage.isi.title
              }
              $scope.datat.push($scope.data);
          }
      })
      angular.forEach(features, function (featur) {
          if (featur.isi.$id !== undefined) {
              $scope.data = {
                  feature: featur.isi.$id,
                  title: featur.isi.title,
                  icon: featur.isi.icon
              }
              $scope.dataf.push($scope.data);
          }
      })

      var infoRef = ref.child($stateParams.overviewId).child("infos");
      infoRef.set($scope.datai);

      var tagRef = ref.child($stateParams.overviewId).child("tags");
      tagRef.set($scope.datat);

      var featRef = ref.child($stateParams.overviewId).child("features");
      featRef.set($scope.dataf);

      var kindRef = ref.child($stateParams.overviewId);
      kindRef.update({kind: $scope.datat[0].title});

      $ionicLoading.hide();
      refresh($scope.overview, $scope);
      $ionicHistory.goBack();
  };

  function refresh(temp, overview, $scope, item) {
  }
})

.controller('blogCtrl', function($scope, $state, $ionicLoading, TransactionFactory, MasterFactory, $ionicPopup, myCache) {

  $scope.blogs = [];

  $scope.blogs = TransactionFactory.getBlogs();
  $scope.blogs.$loaded().then(function (x) {
    refresh($scope.blogs, $scope, TransactionFactory);
  }).catch(function (error) {
      console.error("Error:", error);
  });

  $scope.$on('$ionicView.beforeEnter', function () {
    refresh($scope.blogs, $scope);
  });

  $scope.edit = function(item) {
    $state.go('app.addblog', { blogId: item.$id });
  };

  function refresh(blogs, $scope, item) {
  }
})

.controller('addblogCtrl', function($scope, $state, $stateParams, $ionicLoading, $ionicHistory, TransactionFactory, MasterFactory, CurrentUserService, PickTransactionServices, $ionicPopup, myCache) {

  $scope.blog = {'title': '','desc': '','picture': ''};
  $scope.item = {'photo': ''};
  $scope.inEditMode = false;
  $scope.informations = MasterFactory.getInformations();
  $scope.informations.$loaded().then(function (x) {
    refresh($scope.informations, $scope, MasterFactory);
  }).catch(function (error) {
      console.error("Error:", error);
  });
  $scope.tages = MasterFactory.getTags();
  $scope.tages.$loaded().then(function (x) {
    refresh($scope.tages, $scope, MasterFactory);
  }).catch(function (error) {
      console.error("Error:", error);
  });
  $scope.features = MasterFactory.getFeatures();
  $scope.features.$loaded().then(function (x) {
    refresh($scope.features, $scope, MasterFactory);
  }).catch(function (error) {
      console.error("Error:", error);
  });

  if ($stateParams.blogId === '') {
      //
      // New
      //
      $scope.item = {'photo': ''};
      $scope.infos = [];
      $scope.tags = [];
      $scope.feats = [];
      $scope.addinfos = function () {
          $scope.infos.push({})
      }
      $scope.addtags = function () {
          $scope.tags.push({})
      }
      $scope.addfeats = function () {
          $scope.feats.push({})
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
      angular.forEach($scope.tags, function (tage) {
          if (tage.tag !== "") {
            MasterFactory.getTage(tage.tag).then(function(data){
              tage.sel = false;
              tage.isi = {$id: tage.tag, title: tage.title};
            })
          }
      })
      $scope.edittag = function (data) {
        angular.forEach($scope.tags, function (tag) {
            if (tag.tag === data) {
              tag.sel = true;
            }
        })
      }
      $scope.chantag = function (data) {
        angular.forEach($scope.tags, function (tag) {
            if (tag.tag === data) {
              if (tag.isi.$id === data){
                tag.sel = false;
              }
            }
        })
      }
      angular.forEach($scope.feats, function (feat) {
          if (feat.feature !== "") {
            MasterFactory.getFeat(feat.feature).then(function(data){
              feat.sel = false;
              feat.isi = {$id: feat.feature, title: feat.title, icon: feat.icon};
            })
          }
      })
      $scope.editfeat = function (data) {
        angular.forEach($scope.feats, function (feat) {
            if (feat.feature === data) {
              feat.sel = true;
            }
        })
      }
      $scope.chanfeat = function (data) {
        angular.forEach($scope.feats, function (feat) {
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
      var getblog = TransactionFactory.getBlog($stateParams.blogId);
      $scope.inEditMode = true;
      $scope.blog = getblog;
      $scope.infos = getblog.infos;
      if ($scope.infos === undefined) {
        $scope.infos = [];
      }
      if ($scope.blog.video !== ""){
        $scope.blog.isvideo = true;
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
      $scope.tags = getblog.tags;
      if ($scope.tags === undefined) {
        $scope.tags = [];
      }
      angular.forEach($scope.tags, function (tage) {
          if (tage.tag !== "") {
            MasterFactory.getTage(tage.tag).then(function(data){
              tage.sel = false;
              tage.isi = {$id: tage.tag, title: tage.title};
            })
          }
      })
      $scope.edittag = function (data) {
        angular.forEach($scope.tags, function (tag) {
            if (tag.tag === data) {
              tag.sel = true;
            }
        })
      }
      $scope.chantag = function (data) {
        angular.forEach($scope.tags, function (tag) {
            if (tag.tag === data) {
              if (tag.isi.$id === data){
                tag.sel = false;
              }
            }
        })
      }
      $scope.feats = getblog.features;
      if ($scope.feats === undefined) {
        $scope.feats = [];
      }
      angular.forEach($scope.feats, function (feat) {
          if (feat.feature !== "") {
            MasterFactory.getFeat(feat.feature).then(function(data){
              feat.sel = false;
              feat.isi = {$id: feat.feature, title: feat.title, icon: feat.icon};
            })
          }
      })
      $scope.editfeat = function (data) {
        angular.forEach($scope.feats, function (feat) {
            if (feat.feature === data) {
              feat.sel = true;
            }
        })
      }
      $scope.chanfeat = function (data) {
        angular.forEach($scope.feats, function (feat) {
            if (feat.feature === data) {
              if (feat.isi.$id === data){
                feat.sel = false;
              }
            }
        })
      }
      $scope.item = {'photo': $scope.blog.picture};
      $scope.addinfos = function () {
          $scope.infos.push({})
      }
      $scope.addtags = function () {
          $scope.tags.push({})
      }
      $scope.addfeats = function () {
          $scope.feats.push({})
      }
  }

  $scope.$on('$ionicView.beforeEnter', function () {
    $scope.blog = getblog;
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

  $scope.createBlog = function (blog,informations,tages,features) {

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
      if (typeof blog.title === 'undefined' || blog.title === '') {
          $scope.hideValidationMessage = false;
          $scope.validationMessage = "Please enter title"
          return;
      }
      if (typeof blog.desc === 'undefined' || blog.desc === '') {
          $scope.hideValidationMessage = false;
          $scope.validationMessage = "Please enter desc"
          return;
      }
      if (typeof blog.video === 'undefined' || blog.video === '') {
          blog.video = "Kosong";
      }

      $ionicLoading.show({
          template: '<ion-spinner icon="ios"></ion-spinner><br>Adding...'
      });

    if ($stateParams.blogId === '') {

      var photo = $scope.item.photo;
      $scope.temp = {
          title: blog.title,
          picture: photo,
          desc: blog.desc,
          video: blog.video,
          addedby: CurrentUserService.fullname,
          datecreated: Date.now(),
          dateupdated: Date.now()
      }

      /* SAVE OVERVIEW DATA */
      var ref = TransactionFactory.blRef();
      var newChildRef = ref.push($scope.temp);
      $scope.idbl = newChildRef.key;
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
      angular.forEach(tages, function (tage) {
          if (tage.isi.$id !== undefined) {
              $scope.data = {
                  tag: tage.isi.$id,
                  title: tage.isi.title
              }
              $scope.datat.push($scope.data);
          }
      })
      angular.forEach(features, function (featur) {
          if (featur.isi.$id !== undefined) {
              $scope.data = {
                  feature: featur.isi.$id,
                  title: featur.isi.title,
                  icon: featur.isi.icon
              }
              $scope.dataf.push($scope.data);
          }
      })

      var infoRef = ref.child($scope.idbl).child("infos");
      infoRef.set($scope.datai);

      var tagRef = ref.child($scope.idbl).child("tags");
      tagRef.set($scope.datat);

      var featRef = ref.child($scope.idbl).child("features");
      featRef.set($scope.dataf);

      var kindRef = ref.child($scope.idbl);
      kindRef.update({kind: $scope.datat[0].title, topic: $scope.datat[1].title});
    } else {

      /* PREPARE DATA FOR FIREBASE*/
      var photo = $scope.item.photo;
      $scope.temp = {
          title: blog.title,
          picture: photo,
          desc: blog.desc,
          video: blog.video,
          addedby: CurrentUserService.fullname,
          datecreated: Date.now(),
          dateupdated: Date.now()
      }

      /* SAVE OVERVIEW DATA */
      var ref = TransactionFactory.blRef();
      var childRef = ref.child($stateParams.blogId);
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
      angular.forEach(tages, function (tage) {
          if (tage.isi.$id !== undefined) {
              $scope.data = {
                  tag: tage.isi.$id,
                  title: tage.isi.title
              }
              $scope.datat.push($scope.data);
          }
      })
      angular.forEach(features, function (featur) {
          if (featur.isi.$id !== undefined) {
              $scope.data = {
                  feature: featur.isi.$id,
                  title: featur.isi.title,
                  icon: featur.isi.icon
              }
              $scope.dataf.push($scope.data);
          }
      })

      var infoRef = ref.child($stateParams.blogId).child("infos");
      infoRef.set($scope.datai);

      var tagRef = ref.child($stateParams.blogId).child("tags");
      tagRef.set($scope.datat);

      var featRef = ref.child($stateParams.blogId).child("features");
      featRef.set($scope.dataf);

      var kindRef = ref.child($stateParams.blogId);
      kindRef.update({kind: $scope.datat[0].title, topic: $scope.datat[1].title});
    }

      $ionicLoading.hide();
      $scope.blog = {'title': '','desc': '','picture': '','video': ''};
      $scope.item = {'photo': ''};
      $scope.infos = [];
      $scope.tags = [];
      $scope.feats = [];
      $ionicHistory.goBack();

  };

  function refresh(temp, blog, $scope, item) {
    
  }
})

.controller('profileCtrl', function($scope, $state, $ionicLoading, ContactsFactory, CurrentUserService, PickTransactionServices, $ionicPopup, myCache) {

  $scope.profile = {};
  $scope.profile = ContactsFactory.getProfile();
  $scope.profile.$loaded().then(function (x) {
    refresh($scope.profile, $scope, ContactsFactory);
  }).catch(function (error) {
      console.error("Error:", error);
  });

  function refresh(profile, $scope, ContactsFactory) {
  }
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
                  $state.go('app.dashboard', { memberId: firebaseUser.uid, level: thisuser.level });
          });
        });
    }
})

.controller("userCtrl", function($scope, $state, $rootScope, MembersFactory, $ionicLoading) {
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
      var ref = MembersFactory.ref();
      var dRef = ref.child(item.$id);
      dRef.remove();
     
      $ionicLoading.hide();
    }
  };

  function refresh(users, $scope, MembersFactory) {
  }
})

.controller('customerCtrl', function($scope, $state, $ionicLoading, CustomerFactory, $ionicPopup, myCache) {

  $scope.customers = [];

  $scope.customers = CustomerFactory.getCustomers();
  $scope.customers.$loaded().then(function (x) {
    refresh($scope.customer, $scope, CustomerFactory);
  }).catch(function (error) {
      console.error("Error:", error);
  });

  $scope.$on('$ionicView.beforeEnter', function () {
    refresh($scope.informations, $scope);
  });


  $scope.edit = function(item) {
    $state.go('app.addcustomer', { customerId: item.$id });
  };

  $scope.delete = function(item) {
    $state.go('app.deletecustomer', { customerId: item.$id });
  };

  $scope.assigncustomer = function(item) {
    $state.go('app.assigncustomer', { customerId: item.$id });
  };

  function refresh(informations, $scope, item) {
  }
})

.controller('addcustomerCtrl', function($scope, $ionicLoading, CustomerFactory, $stateParams, CurrentUserService, $ionicPopup, myCache, $ionicHistory) {

  $scope.customer = {'name': '','address': '' ,'email': '' ,'phone': '' ,'gender': ''};
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
  if ($stateParams.customerId === '') {
  } else {
      var getcust = CustomerFactory.getCustomer($stateParams.customerId);
      $scope.inEditMode = true;
      $scope.customer = getcust;
      if ($scope.customer.gender !== "") {
        if ($scope.customer.gender == "male") {
          $scope.trigmale;
        } else {
          $scope.trigfemale;
        }
      }
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
      if ($scope.inEditMode) {
        $ionicLoading.show({
            template: '<ion-spinner icon="ios"></ion-spinner><br>Editing...'
        });
        /* PREPARE DATA FOR FIREBASE*/
        $scope.temp = {
            firstName: customer.firstName,
            alamat: customer.alamat,
            email: customer.email,
            telephone: customer.telephone,
            gender: $scope.gender,
            addedby: myCache.get('thisMemberId'),
            dateupdated: Date.now(),
            isEnable: false
        }
        /* SAVE PRODUCT DATA */
        var newCustomer = CustomerFactory.ref();
        var newData = newCustomer.child($stateParams.customerId);
        newData.update($scope.temp, function (ref) {
        });
        $ionicHistory.goBack();
      }
      else {
        $ionicLoading.show({
            template: '<ion-spinner icon="ios"></ion-spinner><br>Adding...'
        });
        /* PREPARE DATA FOR FIREBASE*/
        $scope.temp = {
            firstName: customer.firstName,
            alamat: customer.alamat,
            email: customer.email,
            telephone: customer.telephone,
            gender: $scope.gender,
            addedby: myCache.get('thisMemberId'),
            dateupdated: Date.now(),
            isEnable: false
        }
        /* SAVE PRODUCT DATA */
        var newCustomer = CustomerFactory.ref();
        newCustomer.push($scope.temp);
        $ionicHistory.goBack();
      }
      $ionicLoading.hide();
      $ionicHistory.goBack();
      
      refresh($scope.customer, $scope);
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


