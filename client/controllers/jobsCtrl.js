app.controller('jobsCtrl', ['$scope', '$auth', '$location', '$http', '$uibModal', 'jobDetailService', 'userService', '$window', '$rootScope', function ($scope, $auth, $location, $http, $uibModal, jobDetailService, userService, $window, $rootScope) {

  console.log(userService.user);
  $scope.craigslistData = [];
  $scope.allJobs = [];

  $scope.changeView = function(view){
      $location.path(view); // path not hash
  };

  console.log(userService.user, "<====userservice user")

  var scrapedData = [];

  // scrape the titles and url 60 off craiglist
  $scope.getCraigslist = function () {
    var holder = userService.user.searchKeyword;
    var searchPhrase = holder.replace(' ', '%20');

    var payload = {
      city:     userService.user.searchCity,
      keyword:  searchPhrase
    };

    $http.post('/scrape', payload)
        .success(function(data) {
            scrapedData = data;
            limitCraig();
        })
        .error(function(err) {
            console.log(err, 'error');
        });
  };


  // craiglist job detail scrape
  $scope.getCraigslistDetail = function () {
    var listingUrls = $scope.craigslistData;

      if(listingUrls) {
          for (var i = 0; i < listingUrls.length; i++) {
            var payload = {url: listingUrls[i].url};
            $http.post('/detail', payload)
                .success(function (data) {
                    jobDetailService.craigslist.push(data);
                })
                .error(function (err) {
                    console.log(err, " error");
                });

          }
      }
  };


   // grab data from indeed from the backend route
   $scope.getIndeed = function () {
      var keyword = userService.user.searchKeyword.replace(' ', '%20');
      var state   = userService.user.searchState;
      var city    = userService.user.searchCity;
      var payload = {
        keyword: keyword,
        city: city,
        state: state
      };

      $http.post('/indeed', payload)
          .success(function (data) {
              $scope.indeedData = data.results;
              // console.log($scope.indeedData, ' indeed before detail')
          })
          .error(function (err) {
              console.log(err, ' error');
          });
   };


  $scope.getIndeedDetail = function () {
     var listingData = $scope.indeedData;

     if(listingData) {
       for (var i = 0; i < listingData.length; i++) {
         var payload = {url: listingData[i].url};

         $http.post('/indeed-detail', payload)
             .success(function (data) {
                 jobDetailService.indeed.push(data);
                 // console.log(jobDetailService.indeed, ' indeed after detail');
                 formatIndeed();

             })
             .error(function (err) {
                 console.log(err, " error");
             });
          }
      }
   };


   $scope.getDice = function () {

      var cityState = userService.user.searchCity + ",+" + userService.user.searchState + "&";

      var keyword = userService.user.searchKeyword.replace(' ', ('%20'));

      var payload = {
        cityState: cityState,
        keyword: keyword
      };

      $http.post('/dice', payload)
          .success(function (data) {
              $scope.diceData = jobDetailService.dice.before = data.resultItemList;
              // console.log(jobDetailService.dice.before, " JDS dice before detail");
          })
          .error(function (err) {
              console.log(err, ' error');
          });
   };

  $scope.getDiceDetail = function () {
    var listingData = $scope.diceData;

      if(listingData) {
          for (var i = 0; i < listingData.length; i++) {
            var payload = {url: listingData[i].detailUrl};

            $http.post('/dice-detail', payload)
                .success(function (data) {
                    jobDetailService.dice.push(data);
                    // console.log(jobDetailService.dice, ' dice detail');
                    formatDice();
                })
                .error(function (err) {
                    console.log(err, " error");
                });
        }
    }
  };


   // open the modal for craigslist scrape button
   $scope.openModal = function () {
       var modalInstance = $uibModal.open({
          templateUrl: 'partials/modalTemplate.html',
          controller: 'modalCtrl',
          size: 'lg',
          backdrop: 'static'
        });
    };

   // helper function to remove the "found more jobs near denver" links...
   var rawCraigData = [];
   var limitCraig = function () {
       for (var i = 0; i < 50; i ++) {
           rawCraigData.push(scrapedData[i]);
       }
       formatCraig();
   };

   // helper function that takes title and url frag & pushes them into array as a mapped object
   var formatCraig = function () {
       for (var i = 0; i < 50; i ++) {
           // total length of each string. url is always 18 characters, soo...
           var title = rawCraigData[i].slice(0, (rawCraigData[i].length - 20));
           var urlFrag = rawCraigData[i].slice((rawCraigData[i].length - 20), rawCraigData[i].length);
           $scope.craigslistData.push({
               title: title,
               url: 'https://denver.craigslist.org' + urlFrag
           });
           // console.log($scope.craigslistData, ' cldata before detail');

       }
   };

  // helper function that adds the descrip from dice detail into JDS.dice.Formatted array.
  var formatDice = function () {
      var diceDetail = jobDetailService.dice;
      var dicePre = jobDetailService.dice.before;
      var holder = [];
      // console.log(diceDetail.length, 'dice length');

      for (var i = 0; i < diceDetail.length; i ++) {
          var jobDetail = {};
          jobDetail.title = dicePre[i].jobTitle;
          jobDetail.description = diceDetail[i].description;
          jobDetail.compensation = '';
          jobDetail.url = dicePre[i].detailUrl;
          jobDetail.alchemy;
          holder.push(jobDetail);
      }
      jobDetailService.dice.formatted = holder;

  };

  // helper function that adds the descrip from dice detail into JDS.dice.Formatted array.
  var formatIndeed = function () {
      var indeedDetail = jobDetailService.indeed;
      var indeedPre = $scope.indeedData;
      var holder = [];

      for (var i = 0; i < indeedDetail.length; i ++) {
          var jobDetail = {};
          jobDetail.title = indeedPre[i].jobtitle;
          jobDetail.description = indeedDetail[i].description;
          jobDetail.compensation = '';
          jobDetail.url = indeedPre[i].url;
          jobDetail.alchemy = [];
          holder.push(jobDetail);
      }
      jobDetailService.indeed.formatted = $scope.indeedFormatted = holder;

  };



  var myInit = function () {
    $scope.getCraigslist();
    $scope.getIndeed();
    $scope.getDice();
  };
  angular.element(document).ready(myInit);

}]);


 // $scope.setAllJobs = function () {
 //    var totalAllJobs = [];
 //    var craig = jobDetailService.craiglist || [];
 //    var indeed = jobDetailService.indeed.formatted || [];
 //    var dice = jobDetailService.dice.formatted ||[];
 //    // var craigYes = false;
 //    // var indeedYes = false;
 //    // var diceYes = false;



 //    totalAllJobs = craig.concat(indeed).concat(dice);
 //    jobDetailService.alljobs = totalAllJobs;
 //    console.log(jobDetailService.alljobs , 'total all jobs !!');

 //  };
  //   if (craig) {
  //     craigYes = true;
  //   }
  //   if (dice) {
  //     diceYes = true;
  //   }
  //   if (indeed) {
  //     indeedYes = true;
  //   }

  //   var total;


  //   if (indeedYes === true && diceYes === true && craigYes === true) {
  //     total = jobDetailService.indeed.formatted.length + jobDetailService.dice.formatted.length + jobDetailService.craiglist.length;
  //     console.log(jobDetailService.allJobs, "JDS all jobs");
  //   } else if (indeedYes === true && diceYes === true && craigYes === false) {
  //     total = jobDetailService.indeed.formatted.length + jobDetailService.dice.formatted.length;
  //   } else if (indeedYes === true && diceYes === false && craigYes === true) {
  //     total = jobDetailService.indeed.formatted.length + jobDetailService.craiglist.length;
  //   } else if (indeedYes === false && diceYes === true && craigYes === true) {
  //     total = jobDetailService.dice.formatted.length + jobDetailService.craiglist.length;
  //   } else if (indeedYes === false && diceYes === false && craigYes === true) {
  //     total = jobDetailService.craiglist.length;
  //   } else if (indeedYes === false && diceYes === true && craigYes === false) {
  //     total = jobDetailService.dice.formatted.length;
  //   } else if (indeedYes === true && diceYes === false && craigYes === false) {
  //     total = jobDetailService.indeed.formatted.length;
  //   }

  //   for (var i = 0; i < length; i ++) {
  //     if (indeedYes === true && diceYes === true && craigYes === true) {
  //       totalAllJobs.push(craig[i]);
  //       totalAllJobs.push(dice[i]);
  //       totalAllJobs.push(craig[i]);
  //       jobDetailService.allJobs = totalAllJobs;
  //       console.log(jobDetailService.allJobs, "JDS all jobs");
  //     } else if (indeedYes === true && diceYes === true && craigYes === false) {
  //       totalAllJobs.push(indeed[i]);
  //       totalAllJobs.push(dice[i]);
  //       jobDetailService.allJobs = totalAllJobs;
  //     } else if (indeedYes === true && diceYes === false && craigYes === true) {
  //       totalAllJobs.push(indeed[i]);
  //       totalAllJobs.push(craig[i]);
  //       jobDetailService.allJobs = totalAllJobs;
  //     } else if (indeedYes === false && diceYes === true && craigYes === true) {
  //       totalAllJobs.push(dice[i]);
  //       totalAllJobs.push(craig[i]);
  //       jobDetailService.allJobs = totalAllJobs;
  //     } else if (indeedYes === false && diceYes === false && craigYes === true) {
  //       totalAllJobs.push(craig[i]);
  //       jobDetailService.allJobs = totalAllJobs;
  //     } else if (indeedYes === false && diceYes === true && craigYes === false) {
  //       totalAllJobs.push(dice[i]);
  //       jobDetailService.allJobs = totalAllJobs;
  //     } else if (indeedYes === true && diceYes === false && craigYes === false) {
  //       totalAllJobs.push(craig[i]);
  //       jobDetailService.allJobs = totalAllJobs;
  //     }

  //     console.log(jobDetailService.allJobs, 'all jobs at the end of the function');
  // }

  // };
