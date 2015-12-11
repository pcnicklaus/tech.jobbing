app.controller('detailCtrl', ['$scope', '$rootScope', '$http', '$window', 'userService', 'jobDetailService', '$timeout', function($scope, $rootScope, $http, $window, userService, jobDetailService, $timeout) {

  $scope.selected = true;
  $scope.accepted = false;
  $scope.rejected = false;


  // $scope.switchAnimate = function (job, value) {
  //   $scope.selected = value;
  //   $scope.$apply();
  //   job.selected = value;
  // }

  var myInit = function () {
    var indeed = jobDetailService.indeed.formatted || [];
    var dice = jobDetailService.dice.formatted || [];
    var craig = jobDetailService.craigslist || [];
    $scope.jobDetail = indeed.concat(dice).concat(craig);
  };
  angular.element(document).ready(myInit);

  console.log($scope.jobDetail, 'scope job detail')
  $scope.jobsToSave = [];

  // $scope.animate = false;
  // $scope.animate = function () {
  //   $scope.animate = true;
  //   $timeout(function () {

  //   }, 1000)
  //   .then(function () {
  //     $scope.animate = false;
  //   });
  // };

  $scope.remove = function () {
    // $scope.rejected = true;
    // $scope.rejected = false;
    $scope.jobDetail.splice(index, 1);
    // $scope.rejected = false;
  };

  $scope.add = function () {
     $scope.jobsToSave.push(this.job);
     // $scope.jobDetail.splice($index, 1);
     // $scope.accepted = true;
     // $scope.accepted = false;

     jobDetailService.myJobs = $scope.jobsToSave;
     // $scope.jobDetail.splice($index, 1);
     // $scope.analyze($index);

    // console.log(jobDetailService.myJobs, 'my jobs save')
    // console.log($scope.jobsToSave, 'scope to save');
  };


  $scope.analyze = function ($index) {

      // var description = JSON.stringify($scope.jobDetail[$index].description);
      console.log($scope.jobDetail[$index], 'job detail at index');
      // var url = JSON.stringify($scope.jobDetail[$index].url);
      console.log(description, 'url')
      // var payload = {
      //   description: description
      // };

      // console.log(payload, " this 00000")
      // console.log($scope.jobDetail, $index, $scope.jobDetail[$index]);
      // console.log('scope.jobdetail(index)', $scope.jobDetail[$index])

      // var alchemyData;
      // $http.post('/analyze', payload)
      //       .success(function(data) {

      //           console.log($scope.jobDetail, $index, $scope.jobDetail[$index]);

      //           // alchemyData = data;
      //           console.log($scope.jobDetail[$index], ' scope alchemy RETURN')
      //           $scope.jobDetail[$index].alchemy = data;
      //           $scope.jobsToSave.push(this.job);
      //           jobDetailService.myJobs = $scope.jobsToSave;
      //           $scope.jobDetail.splice($index, 1);
      //       })
      //       .error(function(err) {
      //           console.log(err, 'error');
      //       });

  };


  // $scope.animationClick = function (element, animation){
  //   element = $(element);
  //   element.click(
  //     function() {
  //       element.addClass('animated ' + animation);
  //       //wait for animation to finish before removing classes
  //       window.setTimeout( function(){
  //           element.removeClass('animated ' + animation);
  //       }, 2000);
  //     }
  //   );
  // };


}]);
