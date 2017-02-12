namespace ngpoli.Controllers {


    export class HomeDialog {
      constructor(private $scope: ng.IScope, private $mdDialog: ng.material.IDialogService,
      private UserService: ngpoli.dbServices.UserService){}
    }
    
    export class MainController {
      public currentNavItem;
      constructor(){
           this.currentNavItem = 'home';
      }
    }

    export class AccountController {
      public currentUser = 'default';
      public logOut(){
          localStorage.setItem('bs_user', JSON.stringify({}));
          this.$state.get('main.account').data = {};
          this.$state.go('main.home');
      }
      constructor(private $state: ng.ui.IStateService){
      //  this.currentUser = 'default';
      //   this.currentUser= $state.get('account').data["username"] || 'default';
      }
    }

}
