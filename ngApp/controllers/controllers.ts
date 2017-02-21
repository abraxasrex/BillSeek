namespace ngpoli.Controllers {


    export class HomeDialog {
      constructor(private $scope: ng.IScope, private $mdDialog: ng.material.IDialogService,
      private UserService: ngpoli.dbServices.UserService){}
    }

    export class MainController {
      public currentNavItem: string;
      public isLoggedIn:boolean = false;
      constructor(
        private localStore: ngpoli.Services.localStore,
        private $state: ng.ui.IStateService){
             this.currentNavItem = 'home';
             if(this.localStore.isLoggedIn()){
               this.localStore.loadUserForMain(this);
               this.isLoggedIn = true;
             }
        }
    }

    export class AccountController {
      public currentUser: string = 'default';
      public location;
      public logOut(){
          localStorage.setItem('bs_user', JSON.stringify({}));
          this.$state.get('main.account').data = {};
          this.$state.go('main.home', null, { reload: true });
      }
      constructor(
        private $state: ng.ui.IStateService,
      private $location: ng.ILocationProvider){
        this.location = $location;
      }
    }

}
