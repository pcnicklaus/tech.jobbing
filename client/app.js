var app = angular.module('MyApp', ['ngRoute', 'satellizer', 'ui.bootstrap', 'ngMaterial', 'gajus.swing']);

app.config(function ($routeProvider, $authProvider, $locationProvider) {

    // *** satellizer settings *** //
    $authProvider.github({
        url: '/auth/github',
        clientId: '3083c693b2f00af76cf4',
        redirectUri: window.location.origin
    });
    $authProvider.google({
        url: '/auth/google',
        clientId: '387733802006-t8ge692s6hna68n6tk0pjol5can9mg8d.apps.googleusercontent.com',
        redirectUri: window.location.origin,
    });
    $authProvider.instagram({
        url: '/auth/instagram',
        clientId: 'UPDATE ME',
        redirectUri: window.location.origin,
    });

    $authProvider.facebook({
        url: '/auth/facebook',
        clientId: '860516007380790',
        redirectUri: window.location.origin
    });

    $authProvider.twitter({
        url: '/auth/twitter',
        clientId: 'FQHN1BJSpb5zzRd1MCQ02ks9d',
        redirectUri: window.location.origin

    });

    $routeProvider
        .when('/', {
            templateUrl: 'partials/welcome.html',
            access: {
                restricted: false
            }
        })
        .when('/home', {
            templateUrl: 'partials/home.html',
            access: {
                restricted: false
            }
        })
        .when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'loginCtrl',
            access: {
                restricted: false
            }
        })
        .when('/signup', {
            templateUrl: 'partials/signup.html',
            controller: 'signupCtrl',
            access: {
                restricted: false
            }
        })
        .when('/ping', {
            template: '<h1>Pong</h1>',
            access: {
                restricted: true
            }
        })
        .when('/profile', {
            templateUrl: 'partials/profile.html',
            controller: 'profileCtrl',
            access: {
                restricted: true
            }
        })
        .when('/jobs', {
            templateUrl: 'partials/jobs.html',
            controller: 'jobsCtrl'
        })
        .when('/search', {
            templateUrl: 'partials/search.html',
            controller: 'searchCtrl'
        })

        .when('/jobDetail', {
            templateUrl: 'partials/modalTemplate.html'
        })

        .when('/detail', {
            templateUrl: 'partials/detail.html',
            controller: 'detailCtrl'
        });

        // .otherwise('/');

});

// app.run(function ($rootScope, $location, $route, $auth) {
//     $rootScope.$on('$routeChangeStart', function (event, next, current) {
//         if (next.access.restricted && !$auth.isAuthenticated()) {
//             $location.path('/login');
//             $route.reload();
//         }
//     });
// });
