namespace ngpoli.dbServices{
  export class UserService {
    private UserResource;
    private LoginResource;
    private RegisterResource;
    private UpdateResource;
    // TODO clean up resources
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
    //  TODO post starred item object to db using
      return this.UpdateResource.save({id: user._id}, user).$promise;
    }
    constructor($resource:ng.resource.IResourceService){
      this.UserResource = $resource('/api/users/:id');
      this.LoginResource = $resource('/api/users/login');
      this.RegisterResource = $resource('/api/users/register');
      this.UpdateResource = $resource('/api/users/update/:id');
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
