namespace ngpoli.dbServices{
  export class UserService {
    private UserResource;
    public get(id){
      return this.UserResource.get({id:id}).$promise;
    }
    public list(){
      return this.UserResource.query().$promise;
    }
    public save(user){
      return this.UserResource.save({id:user._id}, user).$promise;
    }
    public remove(user){
      return this.UserResource.remove({id: user._id}, user).$promise;
    }
    constructor($resource:ng.resource.IResourceService){
      this.UserResource = $resource('/api/users/:id');
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
