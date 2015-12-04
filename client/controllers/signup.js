app.controller('signupCtrl', ['$scope', '$http', '$auth', '$location', 'userService', function($scope, $http, $auth, $location, userService) {

  $scope.signup = function() {

    var user = {
      name: $scope.firstName,
      email: $scope.email,
      password: $scope.password,
      searchTitle: $scope.searchTitle,
      searchKeyword: $scope.searchKeyword,
      searchCity: $scope.searchCity,
      searchState: $scope.searchState,
      myJobs: []
    };

    userService.user.name = user.name;
    userService.user.searchTitle = user.searchTitle;
    userService.user.searchKeyword = user.searchKeyword;
    userService.user.searchState = user.searchState;
    userService.user.searchCity = user.searchCity;
    console.log(userService.user);

    $auth.signup(user)
      .then(function(response){
        $location.path('/login');
      })
      .catch(function(response) {
        console.log(response.data);
      });

  };

}]);
