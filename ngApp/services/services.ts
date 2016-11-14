namespace ngpoli.Services {
    let govTrackApi = 'https://www.govtrack.us/api/v2/bill?';
    let appApi = '/tags';

    export class govTrackService {
      public govTrackResource;
      constructor($resource: ng.resource.IResourceService){
        this.govTrackResource = $resource(govTrackApi);
      }
      public govTrackFetch(){
        return this.govTrackResource;
      }
    }

    export class appApiService {
      public apiResource;
      constructor($resource: ng.resource.IResourceService){
        this.apiResource = $resource(appApi);
      }
      public fetchTags(){
        return this.apiResource;
      }
      public postTags (){
        
      }
    }
      angular.module('ngpoli').service('govTrackService', govTrackService);
      angular.module('ngpoli').service('appApiService', appApiService);
    }
