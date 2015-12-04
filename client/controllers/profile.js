app.controller('profileCtrl', ['$scope', '$rootScope', '$http', '$window', 'userService', function($scope, $rootScope, $http, $window, userService) {

  $scope.email = JSON.parse(localStorage.getItem('currentUser')).email;
  $scope.newEmail = $scope.email;

  $scope.updateUser = function(email, password) {
    $scope.message = "";
    // create payload
    var payload = {};
    payload.email = email;
    payload.newSearchTitle = userService.user.searchTitle = $scope.newSearchTitle;
    payload.newSearchKeyword = userService.user.searchKeyword = $scope.newSearchKeyword;
    payload.newSearchState = userService.user.searchState = $scope.newSearchState;
    payload.newSearchCity = userService.user.searchCity = $scope.newSearchCity;
    payload._id = JSON.parse(localStorage.getItem('currentUser'))._id;
    if(password) {
      payload.password = password;
    }
    console.log(payload);
    // send XHR request
    $http.put('/auth/update', payload)
      .success(function (data, status) {
        if(status === 200 && data){
          delete $window.localStorage.currentUser;
          $window.localStorage.currentUser = JSON.stringify(data);
          $rootScope.currentUser = JSON.parse(localStorage.getItem('currentUser'));
          $scope.email = JSON.parse(localStorage.getItem('currentUser')).email;
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

}]);
