app.controller('loginCtrl', ['$scope', '$auth', '$rootScope', '$window', '$location', 'userService', function($scope, $auth, $rootScope, $window, $location, userService) {

  console.log(userService.user);

  $scope.login = function() {

    var user = {
      email: $scope.email,
      password: $scope.password
    };

    $auth.login(user)
      .then(function(response) {

        userService.user.searchTitle = response.data.user.searchTitle;
        userService.user.searchKeyword = response.data.user.searchKeyword;
        userService.user.searchState = response.data.user.searchState;
        userService.user.searchCity = response.data.user.searchCity;

        $window.localStorage.currentUser = JSON.stringify(response.data.user);
        $rootScope.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        $location.path('/search');
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
        $location.path('/search');
      })
    .catch(function(response) {
      console.log(response);
    });

  };

}]);
