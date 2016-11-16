namespace ngpoli.Services {
    const govTrackApi = 'https://www.govtrack.us/api/v2/bill?';
    const appApi = '/api/tags';

    export class govTrackService {
      public govTrackResource;
      constructor($resource: ng.resource.IResourceService){
        this.govTrackResource = $resource(govTrackApi);
      }
      public get(){
        return this.govTrackResource.get().$promise;
      }
      public post(){
        return this.govTrackResource.post().$promise;
      }
    }

    export class appApiService {
      public appApiResource;
      public appDelResource;
      constructor($resource: ng.resource.IResourceService){
        this.appApiResource = $resource(appApi);
        this.appDelResource = $resource(appApi + '/:name', {name:'@name'})
      }
      public getTag(){
        return this.appApiResource.query().$promise;
      }
      public postTag (tag){
       return this.appApiResource.save(tag).$promise;
      }
      public removeTag(tagName){
        return this.appDelResource.remove(tagName).$promise;
      }
    }
      angular.module('ngpoli').service('govTrackService', govTrackService);
      angular.module('ngpoli').service('appApiService', appApiService);
    }
