
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

      if(this.localStore.isLoggedIn()){
      //  this.$state.go('interests', {user: this.currentUserName}, {notify: false});
        localStore.loadUser(this);
        let data = this.$state.get("main.account").data;
        UserService.loadNotifications(data).then((notifications)=>{
          this.notifications = notifications;
          console.log(this.notifications);
        }).catch((e) => {throw new Error(e);});

      } else {
        //TODO
      //  this.currentUserName = $stateParams["username"];
      //  load special case site
      //1. allow no other navigation
      //2. find alternate listing system: controller user inherits from db?
      }
    }
  list(){
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
  deNotify(notification){
    let user = this.$state.get('main.account').data;
    user.notifications.splice(user.notifications.indexOf(notification), 1);
    this.$state.get('main.account').data = user;
    this.notifications = user.notifications;
    this.UserService.update(user).then((_user)=>{
    }).catch((err)=>{
      console.log(err);
    });
  }
  removeItem (item){
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
