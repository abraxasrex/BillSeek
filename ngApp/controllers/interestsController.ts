
namespace ngpoli.Controllers{


export class InterestsController {
  public starredItems = [];
  public notifications = [];
  public currentUserName;
  constructor(
    private UserService: ngpoli.dbServices.UserService,
    private govTrackService: ngpoli.Services.govTrackService,
    private localStore: ngpoli.Services.localStore,
    private $stateParams: ng.ui.IStateParamsService,
    private $state: ng.ui.IStateService) {

      if(this.localStore.isLoggedIn() ){
        localStore.loadUser(this);
            if(!this.$state.params["username"]){
              let data = this.$state.get("main.account").data;
              UserService.loadNotifications(data).then((notifications)=>{
                this.notifications = notifications;
              }).catch((e) => { throw new Error(e); });
            } else {
              this.visitorView();
            }
      } else {
        this.visitorView();
      }
    }

    public visitorView(){
      let currentUserName = this.$stateParams["username"];
      console.log('i am not on my page: ', currentUserName);
      this.UserService.visitorView(this.$stateParams["username"]).then((results)=>{
        this.visitorPopulate(results);
      }).catch((e)=>{ throw new Error(e); });
    }

  public visitorPopulate(user){
    this.starredItems = [];
    this.notifications = [];
    user.starredItems.forEach((star)=>{
      this.govTrackService.getOne(star).then((result)=>{
          this.starredItems.push(result);
       });
     });
   this.notifications = user.notifications;
  }

  public list(){
      this.starredItems = [];
      let stars = this.$state.get('main.account').data["starredItems"] || [];
            stars.forEach((star)=>{
                this.govTrackService.getOne(star).then((result)=>{
                   this.starredItems.push(result);
                });
           });
          this.notifications = this.$state.get('main.account').data["notifications"];
          console.log(this.$state.get('main.account').data["notifications"]);
    }

    public deNotify(notification){
      let user = this.$state.get('main.account').data;
      user.notifications.splice(user.notifications.indexOf(notification), 1);
      this.$state.get('main.account').data = user;
      this.notifications = user.notifications;
      this.UserService.update(user).then((_user)=>{
      }).catch((err)=>{
        console.log(err);
      });
    }

  public removeItem (item){
     let user = this.$state.get('main.account').data;
     let stars = user["starredItems"];
     let starIds = stars.map((star) => star.id);
     let idx = starIds.indexOf(item["id"]);
     user["starredItems"].splice(idx, 1);
     this.UserService.update(user).then((_user)=>{
       this.localStore.cache(_user);
       this.$state.get('main.account').data = _user;
       this.list();
     });
  }

}
}
