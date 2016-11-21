namespace ngpoli.Controllers {
    // let targetUrl = 'https://www.govtrack.us/api/v2/role?current=true';
    export class HomeController {
        public authUser; public isNewUser = false;
        constructor(private UserService: ngpoli.dbServices.UserService,
          private $mdDialog: ng.material.IDialogService,
          private $scope: ng.IScope){
            this.openDialog();
        }
        public trySubmit(isNew, user){
          isNew ? this.tryRegister(user) : this.tryLogin(user);
        }
        public tryRegister(user){
          this.UserService.register(user).then((result)=>{
            console.log('result from server:', result);
            this.$mdDialog.hide();
          }).catch((err)=>{
            console.log('err: ', err);
            if(err.data == 'dupe'){

            }
          });
        }
        public tryLogin(user){
          this.UserService.login(user).then((result)=>{
            console.log('result from server:', result);
            this.$mdDialog.hide();
          }).catch((err)=>{
            console.log('err: ', err);
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
          })
          .then(()=> {
          }, ()=> {
          //  cancel something
           console.log('this should not hide');
          });
        }
    }
    export class HomeDialog {
      constructor(private $scope: ng.IScope, private $mdDialog: ng.material.IDialogService,
      private UserService: ngpoli.dbServices.UserService){}
    }
    export class BillsController {
        public bills;
        public getBills(){
          this.govTrackService.get().then((results)=>{
            this.bills = results.objects;
          });
        }
        constructor(private govTrackService: ngpoli.Services.govTrackService){
          this.getBills();
        }
    }
    export class DialogController {
      public postTag = this.postTag;
      constructor(private $scope: ng.IScope, private $mdDialog: ng.material.IDialogService){}
    }

    export class TagsController {
      public newTag = {}; public editTag = {}; public tagToDelete = {}; public tags;
      public postTag(tag){
        this.appApiService.postTag(tag).then((results)=>{
          this.tags = results.data;
          this.newTag = {};
        });
      }
      public getTags(){
        this.appApiService.getTag().then((results)=>{
          this.tags = results;
        });
      }
      public removeTag(tag){
        this.appApiService.removeTag({_id: tag._id} ).then((results) =>{
          this.tags = results.data;
        });
      }
      public openDialog(tag){
        let vm = this.$scope;
        this.editTag = tag;
          this.$mdDialog.show({
            scope: vm,
            preserveScope: true,
          controller: DialogController,
          templateUrl: 'dialog1.tmpl.html',
          clickOutsideToClose:true
        })
        .then(()=> {
          this.postTag(this.editTag);
        }, ()=> {
          this.editTag = {};
        });
      }
      public cancelEdit(){
        this.$mdDialog.cancel();
      }
      public submitEdit(){
        this.$mdDialog.hide();
      }
      constructor(private appApiService: ngpoli.Services.appApiService,
        private $mdDialog: ng.material.IDialogService, private $scope: ng.IScope){
        this.getTags();
      }
    }
}
