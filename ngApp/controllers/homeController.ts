namespace ngpoli.Controllers{
  export class HomeController {

      public isNewUser: boolean;
      public search: Object = {date: new Date()};
      public billOptions: string;
      public personOptions: string;
      public feedItems: Array<any>;
      public billDate: Date;
      public date: Date = new Date();
      public loadingChange: boolean;
      public billTypes: Array<string> = [
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
      constructor(
        private UserService: ngpoli.dbServices.UserService,
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
          localStore.loadUser(this);
          this.loadingChange = false;
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
          //this.list();
          this.$state.go('main.home', null, { reload: true });
        }, ()=> { /*cancel modal */ });
      }

      public trySubmit(isNew, user){
        let authType;
        isNew? authType = 'register' : authType = 'login';
        this.tryAuth(user, authType);
      }

      public setUser(user){
        console.log("user setuser: ", user);
        this.localStore.cache(user);
        this.$state.get('main.account').data = user;
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
        this.feedItems=[];
        this.loadingChange = true;
        let _search = this.search;
        if(_search["type"] == 'person'){
          _search["options"] = this.personOptions;
          _search["query"] = null;
        } else {
          _search["options"] = this.billOptions;
        }
        this.govTrackService.get(_search).then((results)=>{
          console.log('RESULTTTTTS: ', results);
          if(_search["type"] !== 'bill'){
            this.cleanPeopleFilter(results.objects);
          } else {
            this.feedItems = results.objects;
          }
            this.setStars();
          this.loadingChange = false;
        }).catch((err)=>{
          this.loadingChange = false;
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
        // debugger;
        // resetter: ------------
        this.$state.get('main.account').data.starredItems = [];

        let user = this.$state.get('main.account').data;
        console.log("setstars user: ", user);
        if(user["starredItems"] && user["starredItems"].length){
          let stars = user.starredItems.map((star)=>{
            return star["id"];
          });
          this.feedItems.forEach((item)=>{
            let match = stars.indexOf(item.id);
            match > -1 ? item.starred = true : item.starred = false;
          });
        } else {
         this.$state.get('main.account').data.starredItems = [];
       }
     }

     public rateItem(item){
      //  let vm = this;
      // debugger;
       item.starred = !item.starred;
       let user = this.$state.get('main.account').data;
            console.log("rateitem user: ", user);
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
           stars.splice(_match, 1)
         } else {
           stars.push({id: item.id, type: type});
         }
       } else {
          stars.push({id: item.id, type: type});
       }
       user.starredItems = stars;
       this.$state.get('main.account').data = user;
         console.log("rateitem user: ", user);
       this.localStore.cache(user);
         console.log("rateitem user: ", user);
      let _item = {
        type: type,
        apiLocation: item["link"],
        data: item,
        govId: item["id"]
      };
      if (_item.type != 'bill' ){
         _item.type = 'role';
         _item.apiLocation = _item.data["person"]["link"];
      } else {
        _item.type = 'bill';
      }
       user["govItem"] = _item;
      console.log("rateitem user: ", user);
       this.UserService.update(user).then((_user)=>{
         console.log("response user:", _user);
        this.localStore.cache(_user);
         this.$state.get('main.account').data = _user;
         this.setStars();
       }).catch((e)=>{ throw new Error(e); });
     }

  }
}
