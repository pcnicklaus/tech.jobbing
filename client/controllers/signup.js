app.controller('signupCtrl', function($scope, $http, $auth, $location) {

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

    $auth.signup(user)
      .then(function(response){
        $location.path('/login');
      })
      .catch(function(response) {
        console.log(response.data);
      });

  };

});
