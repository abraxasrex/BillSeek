namespace ngpoli.Controllers {
    export class HomeController {
        public isNewUser;
        public search = {};
        public billOptions;
        public personOptions;
        public feedItems;
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
             //init service for all controllers
            localStore.loadUser(this);
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

        public trySubmit(isNew, user){
          let authType;
          isNew? authType = 'register' : authType = 'login';
          this.tryAuth(user, authType);
        }
        public setUser(user){
          this.localStore.cache(user);
          this.$state.get('account').data = user;
          this.$mdDialog.hide();
        }
        public tryAuth(user, type){
          this.UserService[type](user).then((result)=>{
            this.setUser(result);
          }).catch((err)=>{
            if(err.data == 'dupe'){ alert('duplicate user!'); }
            if(err.data == 'Not Found'){ alert('user not found! make sure your username and password is correct.') }
          });
        }
        public list(){
          let _search = this.search;
          if(_search["type"] == 'person'){
            _search["options"] = this.personOptions;
            _search["query"] = null;
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
        public cleanPeopleFilter(people){
          let names = [];
          let copy = people;
          people.forEach((obj)=>{
            names.push(obj.person.name);
            if(names.indexOf(obj.person.name) || names.indexOf(obj.person.sortname)){
              copy.splice(copy.indexOf(obj), 1);
            }
          });
          setTimeout(()=>{
            this.feedItems = copy;
              this.$scope.$apply();
            }, 1200);
        }
        public setStars(){
          let vm = this;
          let user = this.$state.get('account').data;
          if(user["starredItems"] && user["starredItems"].length){
            let stars = user.starredItems.map((star)=>{
              return star["id"];
            });
            this.feedItems.forEach((item)=>{
              let match = stars.indexOf(item.id);
              match > -1 ? item.checked = true : item.checked = false;
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
           _match > -1 ? stars.splice(_match, 1) : stars.push({id: item.id, type: type});
         } else {
           stars.push({id: item.id, type: type});
         }
         user.starredItems = stars;
         this.$state.get('account').data = user;
         this.localStore.cache(user);

        let _item = {
          type: type,
          apiLocation: item["link"],
          data: item,
          govId: item["id"]
        };

        if (_item.type !== 'bill' ){
           _item.type = 'role';
           _item.apiLocation = _item.data["person"]["link"];
        } else {
          _item.type = 'bill';
        }
        console.log('_item: ', _item);
        console.log('the same damn thing: ', _item.data["person"]["link"]);
         user["govItem"] = _item;
         this.UserService.update(user).then((_user)=>{
          this.localStore.cache(_user);
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
      starredItems = [];
      notifications = [];
      constructor(
        private UserService: ngpoli.dbServices.UserService,
        private govTrackService: ngpoli.Services.govTrackService,
        private localStore: ngpoli.Services.localStore,
        private $state: ng.ui.IStateService) {
          localStore.loadUser(this);
        }
      list(){
        this.starredItems = [];
        let stars = this.$state.get('account').data["starredItems"];
        stars.forEach((star)=>{
            this.govTrackService.getOne(star).then((result)=>{
               this.starredItems.push(result);
            });
        });
        this.notifications = this.$state.get('account').data["notifications"];
      }
      deNotify(notification){
        let user = this.$state.get('account').data;
        user.notifications.splice(user.notifications.indexOf(notification), 1);
        this.$state.get('account').data = user;
        this.notifications = user.notifications;
        this.UserService.update(user).then((_user)=>{
          console.log('updated!');
        }).catch((err)=>{
          console.log(err);
        });
      }
      removeItem (item){
         let user = this.$state.get('account').data;
         let stars = user["starredItems"];
         let starIds = stars.map((star) => star.id);
         let idx = starIds.indexOf(item["id"]);
         user["starredItems"].splice(idx, 1);
         this.UserService.update(user).then((_user)=>{
           this.localStore.cache(_user);
           this.$state.get('account').data = _user;
           this.list();
         });
      }
    }
}
