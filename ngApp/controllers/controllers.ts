namespace ngpoli.Controllers {
    export class HomeController {
        public isNewUser;
        public search = {};
        public billOptions;
        public personOptions;
        public feedItems;
        public people;
        public billDate;
        public billTypes = [
          'all',
          'house_resolution',
          'senate_bill',
          'senate_joint_resolution',
          'house_bill',
          'house_concurrent_resolution',
          'senate_concurrent_resolution',
          'house_joint_resolution',
          'senate_resolution'
        ];
        constructor(private UserService: ngpoli.dbServices.UserService,
          private govTrackService: ngpoli.Services.govTrackService,
          private $mdDialog: ng.material.IDialogService,
          private $state: ng.ui.IStateService,
          private localStore: ngpoli.Services.localStore,
          private $scope: ng.IScope) {
            //init
            this.isNewUser = false;
            let billDate = new Date();
            this.search['date'] = billDate.toISOString();
            billDate.setMonth(billDate.getMonth() - 6);
            this.search = {type: 'bill', query: '', options: '', filter: '', date: billDate};
            this.billOptions = 'current_status=prov_kill_veto';
            this.personOptions = 'all_people';
            //
            let loggedIn = this.localStore.isLoggedIn();
            if(loggedIn){
              this.$state.get('account').data = this.localStore.bootstrap();
              this.list();
            } else {
              this.openDialog();
            }
        }
        public trySubmit(isNew, user){
          isNew ? this.tryRegister(user) : this.tryLogin(user);
        }
        public setUser(user){
          this.localStore.cache(user);
          this.$state.get('account').data = user;
          this.$mdDialog.hide();
        }
        public tryRegister(user){
          this.UserService.register(user).then((result)=>{
            this.setUser(result);
          }).catch((err)=>{
            if(err.data == 'dupe'){
              alert('duplicate user!');
            }
          });
        }
        public tryLogin(user){
          this.UserService.login(user).then((result)=>{
            this.setUser(result);
          }).catch((err)=>{
            if(err.data == 'Not Found'){
            }
          });
        }
        public list(){
          let _search = this.search;
          if(_search["type"] == 'person'){
            _search["options"] = this.personOptions;
          } else {
            _search["options"] = this.billOptions;
          //  _search["date"] = _search["date"].toISOString();
          }
          this.govTrackService.get(_search).then((results)=>{
            if(_search["type"] !== 'bill'){
              //TODO filter
              console.log('length before: ', this.feedItems.length)
            //  this.feedItems = results.objects;
              this.cleanPeopleFilter(results.objects);
            } else {
              this.feedItems = results.objects;
            }
              this.setStars();
          }).catch((err)=>{
            console.log(err);
          });
        }
        public cleanPeopleFilter(objects){
          let names = [];
          let copy = objects;
          objects.forEach((obj)=>{
            names.push(obj.person.name);
            if(names.indexOf(obj.person.name) || names.indexOf(obj.person.sortname)){
              copy.splice(copy.indexOf(obj), 1);
            }
          });
          setTimeout(()=>{
            console.log('copy length: ', copy.length);
            this.feedItems = copy;
              this.$scope.$apply();
            }, 1200
          )
        }
        public openDialog(){
          let vm = this.$scope;
            this.$mdDialog.show({
              scope: vm,
              preserveScope: true,
              controller: HomeDialog,
              templateUrl: 'dialog2.tmpl.html',
              clickOutsideToClose:false
          }).then(()=> { this.list(); }, ()=> { /*cancel modal */ });
        }
         public setStars(){
         let vm = this;
          let stars = this.$state.get('account').data.starredItems;
           if(stars && stars.length){
               this.feedItems.forEach((item)=>{
                 let match = stars.indexOf(item.id);
                 if(match > -1){
                   item.checked = true;
                 } else {
                   item.checked = false;
                 }
             });
           } else {
             this.$state.get('account').data.starredItems = [];
           }
         }
         public rateItem(item){
          item.checked = !item.checked;
           let user = this.$state.get('account').data;
           let stars = [];
           if(user.starredItems && user.starredItems.length){
             stars = user.starredItems;
             let _match = stars.indexOf(item.id);
             if(_match > -1){
               stars.splice(_match, 1);
             } else {
               stars.push(item.id);
             }
           }
           user.starredItems = stars;
           this.$state.get('account').data = user;
           this.localStore.cache(user);
           this.UserService.update(user).then((_user)=>{
             this.$state.get('account').data = _user;
             this.setStars();
           }).catch((err)=>{
              console.log(err);
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
      constructor(private appApiService: ngpoli.Services.appApiService,
        private $mdDialog: ng.material.IDialogService,
        private $scope: ng.IScope){
        this.getLabels();
      }
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
    }
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

    export class InterestsController {
      constructor() {
        //load user information (1. tags, 2. starredItems) regardless of preliminary routing
      }
      postSearchTag() {
        //add tag to user's search tags, thenn bind search tags to home view as well
      }
      deleteItem (){
         //remove starreditem from user profile
      }
      newSearchTag = 'applesauce';
      searchTags = [
        'abc',
        'def',
        'ghi'
      ]
      feedItems = [
       {firstname: 'jogngond'},
       {firstname: 'bonanza'},
       {firstname: 'gggssgsgg'}
      ];
    }
}
