var ngpoli;
(function (ngpoli) {
    angular.module('ngpoli', ['ui.router', 'ngMaterial', 'ngMessages', 'ngResource', 'ngclipboard']).config(function ($stateProvider, $urlRouterProvider, $locationProvider, $mdThemingProvider, $compileProvider) {
        $stateProvider
            .state('main', {
            templateUrl: '/ngApp/views/main.html',
            controller: ngpoli.Controllers.MainController,
            controllerAs: 'vm'
        })
            .state('main.home', {
            url: '/BillSeek',
            templateUrl: '/ngApp/views/home.html',
            controller: ngpoli.Controllers.HomeController,
            controllerAs: 'controller'
        })
            .state('main.interests', {
            url: '/BillSeek/interests/:username',
            templateUrl: '/ngApp/views/interests.html',
            controller: ngpoli.Controllers.InterestsController,
            controllerAs: 'vm'
        })
            .state('main.account', {
            url: '/BillSeek/account',
            templateUrl: '/ngApp/views/account.html',
            controller: ngpoli.Controllers.AccountController,
            controllerAs: 'controller'
        })
            .state('notFound', {
            url: '/BillSeek/notFound',
            templateUrl: '/ngApp/views/notFound.html'
        });
        $urlRouterProvider.otherwise('/notFound');
        $locationProvider.html5Mode(true);
        $mdThemingProvider
            .theme('default')
            .primaryPalette('blue')
            .accentPalette('blue')
            .warnPalette('red')
            .backgroundPalette('blue');
        $compileProvider.preAssignBindingsEnabled(true);
    });
})(ngpoli || (ngpoli = {}));
