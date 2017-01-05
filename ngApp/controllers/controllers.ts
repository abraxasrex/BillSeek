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
          }
          this.govTrackService.get(_search).then((results)=>{
            if(_search["type"] !== 'bill'){
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
          let stars = this.$state.get('account').data.starredItems.map((star)=>{
            return star.id;
          });
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
           let type;
           if(item["person"]){
             type = 'role';
           }
           if(item["current_status_description"]){
             type = 'bill';
           }
           if(user.starredItems && user.starredItems.length){
             stars = user.starredItems;
             let starIds = stars.map((star)=>{
               return star.id;
             });
             let _match = starIds.indexOf(item.id);
             if(_match > -1){
               stars.splice(_match, 1);
             } else {
               stars.push({id: item.id, type: type});
             }
           } else {
             stars.push({id: item.id, type: type});
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
      constructor(
        private UserService: ngpoli.dbServices.UserService,
          private govTrackService: ngpoli.Services.govTrackService,
          private localStore: ngpoli.Services.localStore,
        private $state: ng.ui.IStateService) {
        //load user information (1. tags, 2. starredItems) regardless of preliminary routing
          this.getStarredItems();
      }
      getStarredItems(){
        this.starredItems = [];
        let stars = this.$state.get('account').data["starredItems"];
        stars.forEach((star)=>{
            ///// use a new service
            this.govTrackService.getOne(star).then((result)=>{
              console.log('getone result: ', result);
               this.starredItems.push(result);
            });
        });
      }
      removeItem (item){
         //remove starreditem from user profile
         let user = this.$state.get('account').data
         let stars = user["starredItems"];
         let starIds = stars.map((star) => star.id);
         let idx = starIds.indexOf(item["id"]);

         user["starredItems"].splice(idx, 1);

         this.UserService.update(user).then((_user)=>{
           this.localStore.cache(_user);
           this.$state.get('account').data = _user;
           this.getStarredItems();
         });
      }
      starredItems = [ ];
    }
}
