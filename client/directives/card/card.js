app.directive('card', experienceViewDirective);

    function cardDirective() {

        return {
            restrict: 'E',
            templateUrl: 'directives/card/card.html',
            scope: {},
            controller: ExperienceViewController,
            controllerAs: 'vm',
            bindToController: true,
        };
    }

    CardController.$inject = [
        'jobDetailService'
    ];


    function CardController() {

        var vm = this;
        vm.cards = jobDetailService.dice.formatted;

    }
