namespace ngpoli {
    ///hii
    angular.module('ngpoli', ['ui.router', 'ngMaterial', 'ngMessages', 'ngResource', 'ngclipboard']).config((
        $stateProvider: ng.ui.IStateProvider,
        $urlRouterProvider: ng.ui.IUrlRouterProvider,
        $locationProvider: ng.ILocationProvider,
        $mdThemingProvider: ng.material.IThemingProvider,
        $compileProvider
    ) => {
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
              // params: {
              //   username: null
              // },
              templateUrl: '/ngApp/views/interests.html',
              controller: ngpoli.Controllers.InterestsController,
              controllerAs: 'vm'
            })
            .state('main.account',{
              url:'/BillSeek/account',
              templateUrl:'/ngApp/views/account.html',
              controller: ngpoli.Controllers.AccountController,
              controllerAs: 'controller'
            })
            .state('notFound', {
                url: '/BillSeek/notFound',
                templateUrl: '/ngApp/views/notFound.html'
            });

        // Handle request for non-existent route
        $urlRouterProvider.otherwise('/notFound');

        // Enable HTML5 navigation
        $locationProvider.html5Mode(true);
         //red, pink, purple, deep-purple, indigo, blue,
         //light-blue, cyan, teal, green, light-green,
         //lime, yellow, amber, orange, deep-orange, brown, grey, blue-grey
        $mdThemingProvider
          .theme('default')
          .primaryPalette('blue',
          'default': '400', // by default use shade 400 from the pink palette for primary intentions
           'hue-1': '100')
          //form focus / tabs
          .accentPalette('blue')
                    // navbar highlighting (focus?)
          .warnPalette('red')
          //danger
          .backgroundPalette('blue');
          //md content backgrounds




             //precompile to fix datepicker
            $compileProvider.preAssignBindingsEnabled(true);
    });
}
