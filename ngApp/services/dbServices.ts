namespace ngpoli.dbServices{
  export class UserService {
    private UserResource;
    private LoginResource;
    private RegisterResource;
    private UpdateResource;
    private NotificationResource;
    private VisitorViewResource;

    public get(id){
      return this.UserResource.get({id:id}).$promise;
    }
    public list(){
      return this.UserResource.query().$promise;
    }
    public save(user){
      return this.UserResource.save({id:user._id}, user).$promise;
    }
    public login(user){
      return this.LoginResource.save(user).$promise;
    }
    public register(user){
      return this.RegisterResource.save(user).$promise;
    }
    public remove(user){
      return this.UserResource.remove({id: user._id}, user).$promise;
    }
    public update(user){
      //TODO change to 'PUT'
      return this.UpdateResource.save({id: user._id}, user).$promise;
    }
    public loadNotifications(user){
      return this.NotificationResource.query({id: user._id}).$promise;
    }
    public visitorView(username){
      return this.VisitorViewResource.get({username: username}).$promise;
    }
    constructor($resource:ng.resource.IResourceService){
      this.NotificationResource = $resource('/api/users/notifications/:id');
      this.UserResource = $resource('/api/users/:id');
      this.LoginResource = $resource('/api/users/login');
      this.RegisterResource = $resource('/api/users/register');
      this.UpdateResource = $resource('/api/users/update/:id');
      this.VisitorViewResource = $resource('/api/users/visitorView/:username');
    }
  }

  export class GovTrackService {
    private GovResource;
    public get(id){
      return this.GovResource.get({id:id}).$promise;
    }
    public list(){
      return this.GovResource.query().$promise;
    }
    public save(govItem){
      return this.GovResource.save({id:govItem._id}, govItem).$promise;
    }
    public remove(govItem){
      return this.GovResource.remove({id: govItem._id}, govItem).$promise;
    }
    constructor($resource:ng.resource.IResourceService){
      this.GovResource = $resource('/api/govItems/:id');
    }
  }
  angular.module('ngpoli').service('UserService', UserService);
  angular.module('ngpoli').service('GovTrackService', GovTrackService);
}
