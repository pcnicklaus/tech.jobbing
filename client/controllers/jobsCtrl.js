app.controller('jobsCtrl', ['$scope', '$auth', '$location', '$http', '$uibModal', 'jobDetailService', 'userService', function ($scope, $auth, $location, $http, $uibModal, jobDetailService, userService) {

  console.log(userService.user);
  $scope.craigslistData = [];

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
                    console.log(jobDetailService.craigslist, ' craig detail')

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
      var state   = userService.user.searchState.trim();
      var city    = userService.user.searchCity.trim();
      var payload = {
        keyword: keyword,
        city: city,
        state: state
      };

      $http.post('/indeed', payload)
          .success(function (data) {
              $scope.indeedData = data.results;
              console.log($scope.indeedData, ' indeed before detail')
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
                 console.log(jobDetailService.indeed, ' indeed detail');
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
              console.log(jobDetailService.dice.before, " JDS dice before detail");
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
                    console.log(jobDetailService.dice, ' dice detail');
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
           console.log($scope.craigslistData, ' cldata before detail');

       }
       // not sure if this will work.
   };

  // helper function that adds the descrip from dice detail into JDS.dice.Formatted array.
  var formatDice = function () {
    console.log('firing');
      var diceDetail = jobDetailService.dice;
      var dicePre = jobDetailService.dice.before;
      var holder = [];

      for (var i = 0; i < diceDetail.length; i ++) {
          var jobDetail = {};
          jobDetail.title = dicePre[i].jobTitle;
          jobDetail.description = diceDetail[i].description;
          jobDetail.compensation = '';
          jobDetail.url = dicePre[i].detailUrl;
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
          holder.push(jobDetail);
      }
      jobDetailService.indeed.formatted = holder;
  };

}]);
