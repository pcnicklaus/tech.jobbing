app.controller('reviewCtrl', ['$scope', '$rootScope', '$http', '$window', 'userService', 'jobDetailService', function($scope, $rootScope, $http, $window, userService, jobDetailService) {

  var myInit = function () {
    $scope.myJobs = jobDetailService.myJobs;

  };
  angular.element(document).ready(myInit);

   $scope.remove = function (index) {
    $scope.myJobs.splice(index, 1);
  };


  console.log($scope.myJobs, 'myjobs in reveiw ctrl ')




}]);
