var ngpoli;
(function (ngpoli) {
    var Controllers;
    (function (Controllers) {
        var HomeDialog = (function () {
            function HomeDialog($scope, $mdDialog, UserService) {
                this.$scope = $scope;
                this.$mdDialog = $mdDialog;
                this.UserService = UserService;
            }
            return HomeDialog;
        }());
        Controllers.HomeDialog = HomeDialog;
        var MainController = (function () {
            function MainController(localStore, $state) {
                this.localStore = localStore;
                this.$state = $state;
                this.isLoggedIn = false;
                this.currentNavItem = 'home';
                if (this.localStore.isLoggedIn()) {
                    this.localStore.loadUserForMain(this);
                    this.isLoggedIn = true;
                }
            }
            return MainController;
        }());
        Controllers.MainController = MainController;
        var AccountController = (function () {
            function AccountController($state, $location) {
                this.$state = $state;
                this.$location = $location;
                this.currentUser = 'default';
                this.location = $location;
            }
            AccountController.prototype.logOut = function () {
                localStorage.setItem('bs_user', JSON.stringify({}));
                this.$state.get('main.account').data = {};
                this.$state.go('main.home', null, { reload: true });
            };
            return AccountController;
        }());
        Controllers.AccountController = AccountController;
    })(Controllers = ngpoli.Controllers || (ngpoli.Controllers = {}));
})(ngpoli || (ngpoli = {}));
