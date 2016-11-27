namespace ngpoli {
    ///hii
    angular.module('ngpoli', ['ui.router', 'ngMaterial', 'ngMessages', 'ngResource']).config((
        $stateProvider: ng.ui.IStateProvider,
        $urlRouterProvider: ng.ui.IUrlRouterProvider,
        $locationProvider: ng.ILocationProvider
    ) => {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/ngApp/views/home.html',
                controller: ngpoli.Controllers.HomeController,
                controllerAs: 'controller'
            })
            .state('tags',{
              url:'/tags',
              templateUrl:'/ngApp/views/tags.html',
              controller: ngpoli.Controllers.TagsController,
              controllerAs: 'controller'
            })
            .state('account',{
              url:'/account',
              templateUrl:'/ngApp/views/account.html',
              controller: ngpoli.Controllers.AccountController,
              controllerAs: 'controller',
              data:{
                username: '',
                stars: []
              }
            })
            .state('notFound', {
                url: '/notFound',
                templateUrl: '/ngApp/views/notFound.html'
            });

        // Handle request for non-existent route
        $urlRouterProvider.otherwise('/notFound');

        // Enable HTML5 navigation
        $locationProvider.html5Mode(true);
    });
}
