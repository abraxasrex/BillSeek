namespace ngpoli.Controllers {
    // let targetUrl = 'https://www.govtrack.us/api/v2/role?current=true';
    export class AccountController {
      public currentUser = 'default';
      public logOut(){
          localStorage.setItem('bs_user', JSON.stringify({}));
          this.$state.get('account').data = {};
          this.$state.go('home');
      }
      constructor(private $state: ng.ui.IStateService){
        this.currentUser = 'default';
      }
    }
    export class HomeController {
        public authUser;
        public isNewUser = false;
        public bills;
        public search;
        constructor(private UserService: ngpoli.dbServices.UserService,
          private govTrackService: ngpoli.Services.govTrackService,
          private $mdDialog: ng.material.IDialogService,
          private $state: ng.ui.IStateService,
          private localStore: ngpoli.Services.localStore,
          private $scope: ng.IScope){
            let loggedIn = this.localStore.isLoggedIn();
            if(loggedIn){
              this.$state.get('account').data = this.localStore.bootstrap();
              this.getBills();
            } else {
              this.openDialog();
            }
        }
        public trySubmit(isNew, user){
          console.log('trying to submit newuser: ', isNew, ' user: ', user);
          isNew ? this.tryRegister(user) : this.tryLogin(user);
        }
        public setUser(user){
          this.localStore.save(user);
          this.$state.get('account').data = user;
          this.$mdDialog.hide();
        }
        public tryRegister(user){
          console.log('registering');
          this.UserService.register(user).then((result)=>{
            this.setUser(result);
          }).catch((err)=>{
            if(err.data == 'dupe'){
            }
          });
        }
        public tryLogin(user){
          console.log('logggggin');
          this.UserService.login(user).then((result)=>{
            this.setUser(result);
          }).catch((err)=>{
            if(err.data == 'Not Found'){
            }
          });
        }
        public openDialog(){
          let vm = this.$scope;
            this.$mdDialog.show({
              scope: vm,
              preserveScope: true,
              controller: HomeDialog,
              templateUrl: 'dialog2.tmpl.html',
              clickOutsideToClose:false
          }).then(()=> {
            this.getBills();
          }, ()=> {
          });
        }
        public getBills(){
          this.govTrackService.get(this.search).then((results)=>{
            this.bills = results.objects;
          });
        }
    }

    export class HomeDialog {
      constructor(private $scope: ng.IScope, private $mdDialog: ng.material.IDialogService,
      private UserService: ngpoli.dbServices.UserService){}
    }

    export class DialogController {
      public postLabel = this.postLabel;
      constructor(private $scope: ng.IScope, private $mdDialog: ng.material.IDialogService){}
    }

    export class TagsController {
      public newLabel = {};
      public editLabel = {};
      public labelToDelete = {};
      public labels;
      public postLabel(label){

        this.appApiService.postLabel(label).then((results)=>{
          this.labels = results.data;
          this.newLabel = {};
        });
      }
      public getLabels(){
        this.appApiService.getLabels().then((results)=>{
          this.labels = results;
        });
      }
      public removeLabel(label){
        this.appApiService.removeLabel(label).then((results) =>{
          this.labels = results.data;
        });
      }
      public openDialog(label){
        let vm = this.$scope;
        this.editLabel = label;
          this.$mdDialog.show({
            scope: vm,
            preserveScope: true,
          controller: DialogController,
          templateUrl: 'dialog1.tmpl.html',
          clickOutsideToClose:true
        })
        .then(()=> {
          this.postLabel(this.editLabel);
        }, ()=> {
          this.editLabel = {};
        });
      }
      public cancelEdit(){
        this.$mdDialog.cancel();
      }
      public submitEdit(){
        this.$mdDialog.hide();
      }
      constructor(private appApiService: ngpoli.Services.appApiService,
        private $mdDialog: ng.material.IDialogService,
        private $scope: ng.IScope){
        this.getLabels();
      }
    }
}
