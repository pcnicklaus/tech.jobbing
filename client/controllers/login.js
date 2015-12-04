app.controller('loginCtrl', ['$scope', '$auth', '$rootScope', '$window', '$location', 'userService', function($scope, $auth, $rootScope, $window, $location, userService) {

  $scope.login = function() {

    var user = {
      email: $scope.email,
      password: $scope.password
    };

    $auth.login(user)
      .then(function(response) {
        console.log(response, ' is this the user');

        userService.user.searchTitle = response.data.user.searchTitle;
        userService.user.searchKeyword = response.data.user.searchKeyword;
        userService.user.searchState = response.data.user.searchState;
        userService.user.searchCity = response.data.user.searchCity;
        console.log(userService.user);


        $window.localStorage.currentUser = JSON.stringify(response.data.user);
        $rootScope.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        $location.path('/home');
      })
      .catch(function(response) {
        console.log(response);
      });
  };

  $scope.authenticate = function(provider) {

    $auth.authenticate(provider)
      .then(function(response) {
        $window.localStorage.currentUser = JSON.stringify(response.data.user);
        $rootScope.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        console.log(response);
        $location.path('/home');
      })
    .catch(function(response) {
      console.log(response);
    });

  };

}]);
