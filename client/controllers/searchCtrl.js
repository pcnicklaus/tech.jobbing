app.controller('searchCtrl', ['$scope', '$auth', '$location', '$http', '$uibModal', 'userService', '$window', '$rootScope', function ($scope, $auth, $location, $http, $uibModal, userService, $window, $rootScope) {


$scope.email = JSON.parse(localStorage.getItem('currentUser')).email;

  $scope.updateSearch = function() {
    $scope.message = "";
    // create payload
    var payload = {};
    payload.newSearchTitle = userService.user.searchTitle = $scope.newSearchTitle;
    payload.newSearchKeyword = userService.user.searchKeyword = $scope.newSearchKeyword;
    payload.newSearchState = userService.user.searchState = $scope.newSearchState;
    payload.newSearchCity = userService.user.searchCity = $scope.newSearchCity;
    payload._id = JSON.parse(localStorage.getItem('currentUser'))._id;

    console.log(payload);
    // send XHR request
    $http.put('/auth/update', payload)
      .success(function (data, status) {
        if(status === 200 && data){
          console.log('data :::::', data)
          delete $window.localStorage.currentUser;
          $window.localStorage.currentUser = JSON.stringify(data);
          $rootScope.currentUser = JSON.parse(localStorage.getItem('currentUser'));
          // $scope.email = JSON.parse(localStorage.getItem('currentUser')).email;
          userService.user.searchKeyword = data.searchKeyword;
          userService.user.searchCity = data.searchCity;
          userService.user.searchTitle = data.searchTitle;
          userService.user.searchState = data.searchState;
          console.log(userService.user);
          $scope.message = "Updated!";
          $scope.password = "";
        } else {
          console.log('handle error');
        }
      })
      .error(function (err) {
        console.log('handle error: ', err);
      });
  };

  $scope.changeView = function(view){
      $location.path(view); // path not hash
  };



}]);
