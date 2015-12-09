app.controller('navbarCtrl', function($scope, $window, $auth, $location) {

  $scope.isAuthenticated = function() {
    return $auth.isAuthenticated();
  };

  $scope.logout = function() {
    $auth.logout();
    delete $window.localStorage.currentUser;
    $location.path('/home');
  };

  // $scope.isActive = function(route) {
  //         return route === $location.path();
  //     };

  // $scope.navActive = "Home";
  $scope.isActive = function (id) {
          if ($scope.navActive === id) {
              return true;
              console.log($scope.navActive, id)
          } else {
              return false;
          }
      };

});
