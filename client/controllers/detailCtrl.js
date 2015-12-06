app.controller('detailCtrl', ['$scope', '$rootScope', '$http', '$window', 'userService', 'jobDetailService', function($scope, $rootScope, $http, $window, userService, jobDetailService) {

  var myInit = function () {
    $scope.jobDetail = jobDetailService.indeed.formatted;

  };
  angular.element(document).ready(myInit);

  $scope.jobsToSave = [];

  $scope.remove = function (index) {
    $scope.jobDetail.splice(index, 1);
  };

  $scope.add = function () {
    $scope.jobsToSave.push(this.job);
    console.log(this.job, 'jobs to save')
    console.log($scope.jobsToSave, 'scope to save');
  };

  $scope.cards = jobDetailService.indeed.formatted;

  // $scope.throwout = function (eventName, eventObject) {
  //     console.log('throwout', eventObject);
  // };

  // $scope.throwoutleft = function (eventName, eventObject) {
  //     console.log('throwoutleft', eventObject);
  // };

  // $scope.throwoutright = function (eventName, eventObject) {
  //     console.log('throwoutright', eventObject);
  // };

  // $scope.throwin = function (eventName, eventObject) {
  //     console.log('throwin', eventObject);
  // };

  // $scope.dragstart = function (eventName, eventObject) {
  //     console.log('dragstart', eventObject);
  // };

  // $scope.dragmove = function (eventName, eventObject) {
  //     console.log('dragmove', eventObject);
  // };

  // $scope.dragend = function (eventName, eventObject) {
  //     console.log('dragend', eventObject);
  // };

  // $scope.options = {
  //     throwOutConfidence: function (offset, elementWidth) {
  //         console.log('throwOutConfidence', offset, elementWidth);
  //         return Math.min(Math.abs(offset) / elementWidth, 1);
  //     },
  //     isThrowOut: function (offset, elementWidth, throwOutConfidence) {
  //         console.log('isThrowOut', offset, elementWidth, throwOutConfidence);
  //         return throwOutConfidence === 1;
  //     }
  // };


  // $scope.email = JSON.parse(localStorage.getItem('currentUser')).email;
  // $scope.newEmail = $scope.email;

  // $scope.updateUser = function(email, password) {
  //   $scope.message = "";
  //   // create payload
  //   var payload = {};
  //   payload.email = email;
  //   payload.newSearchTitle = userService.user.searchTitle = $scope.newSearchTitle;
  //   payload.newSearchKeyword = userService.user.searchKeyword = $scope.newSearchKeyword;
  //   payload.newSearchState = userService.user.searchState = $scope.newSearchState;
  //   payload.newSearchCity = userService.user.searchCity = $scope.newSearchCity;
  //   payload._id = JSON.parse(localStorage.getItem('currentUser'))._id;
  //   if(password) {
  //     payload.password = password;
  //   }
  //   console.log(payload);
  //   // send XHR request
  //   $http.put('/auth/update', payload)
  //     .success(function (data, status) {
  //       if(status === 200 && data){
  //         delete $window.localStorage.currentUser;
  //         $window.localStorage.currentUser = JSON.stringify(data);
  //         $rootScope.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  //         $scope.email = JSON.parse(localStorage.getItem('currentUser')).email;
  //         $scope.message = "Updated!";
  //         $scope.password = "";
  //       } else {
  //         console.log('handle error');
  //       }
  //     })
  //     .error(function (err) {
  //       console.log('handle error: ', err);
  //     });
  // };



}]);
