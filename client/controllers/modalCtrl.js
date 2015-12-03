app.controller('modalCtrl', ['$scope','$uibModalInstance', 'jobDetailService', function($scope, $uibModalInstance, jobDetailService) {
    console.log(jobDetailService.jobDetail);
     $scope.closeModal = function () {
         console.log("test");
         $uibModalInstance.dismiss('cancel');
     };
}]);
