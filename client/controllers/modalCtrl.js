app.controller('modalCtrl', ['$scope','$uibModalInstance', 'jobDetailService', function($scope, $uibModalInstance, jobDetailService) {
    console.log('jobDetail', jobDetailService.jobDetail);
    $scope.jobDetail = jobDetailService.jobDetail;
     $scope.closeModal = function () {
         console.log("test");
         $uibModalInstance.dismiss('cancel');
     };
}]);
