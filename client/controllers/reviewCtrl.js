app.controller('reviewCtrl', ['$scope', '$rootScope', '$http', '$window', 'userService', 'jobDetailService', function($scope, $rootScope, $http, $window, userService, jobDetailService) {

  var myInit = function () {
    $scope.myJobs = jobDetailService.myJobs;

  };
  angular.element(document).ready(myInit);

   $scope.remove = function (index) {
    $scope.myJobs.splice(index, 1);
  };


  console.log($scope.myJobs, 'myjobs in reveiw ctrl ')

  $scope.sendEmail = function () {

    var test =JSON.stringify($scope.myJobs)
    console.log(test.description, test.title, 'testeeeee')

      // var payload = {
      //   title: JSON.Stringify($scope.myJobs)
      // };
      // console.log(payload.jobs, ' jobs');

      // $http.post('/mail', payload)
      //       .success(function(data) {
      //           scrapedData = data;
      //           limitCraig();
      //       })
      //       .error(function(err) {
      //           console.log(err, 'error');
      //       });


  };

  $scope.analyze = function (index) {
      var payload = {
        description: this.job.description
      };
      console.log(payload);
      var alchemyData;
       $http.post('/analyze', payload)
            .success(function(data) {
                $scope.alchemyData = data;
                console.log(alchemyData);
            })
            .error(function(err) {
                console.log(err, 'error');
            });

  }

}]);
