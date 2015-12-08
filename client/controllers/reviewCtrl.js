app.controller('reviewCtrl', ['$scope', '$rootScope', '$http', '$window', 'userService', 'jobDetailService', function($scope, $rootScope, $http, $window, userService, jobDetailService) {

  var myInit = function () {
    $scope.myJobs = jobDetailService.myJobs;
  };
  angular.element(document).ready(myInit);


  $scope.remove = function (index) {
    $scope.myJobs.splice(index, 1);
  };

  // console.log('ll jobs', jobDetailService.all);
  // console.log('scope all jobs', $scope.allJobs);
  // console.log($scope.myJobs, ' scope my jobs');

  var user = JSON.parse(localStorage.getItem('currentUser'));
  var userEmail = JSON.parse(localStorage.getItem('currentUser'));

  $scope.sendEmail = function () {

    var jobs = $scope.myJobs;

      var payload = {
        jobs: jobs,
        email: userEmail
      };
      console.log(payload.title, ' jobs');

      $http.post('/mail', payload)
            .success(function(data) {
                var responseData = data;
                console.log(responseData, 'resposne data');
            })
            .error(function(err) {
                console.log(err, 'error');
            });


  };

  // $scope.saveJob = function () {
  //   console.log(user, ' save job');
  // }

  $scope.analyze = function ($index) {

      var payload = {
        description: this.job.description
      };

      var alchemyData;
       $http.post('/analyze', payload)
            .success(function(data) {
                $scope.myJobs[$index].alchemy = data;
                console.log($scope.myJobs[$index], ' scope alchemy RETURN')
            })
            .error(function(err) {
                console.log(err, 'error');
            });


  };

}]);
