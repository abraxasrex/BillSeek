namespace ngpoli.Services {
    let targetUrl = 'https://www.govtrack.us/api/v2/role?current=true';
    export class SuperService {
        saySuper(){
            console.log('super');
        }
    }
    export class govTrackService {
      public govTrackResource;
      constructor($resource: ng.resource.IResourceService){
        this.govTrackResource = $resource(targetUrl);
      }
      public govTrackFetch(){
        return this.govTrackResource.get((results)=>{
          return results.data;
        });
      }
    }
      angular.module('ngpoli').service('SuperService', SuperService);
      angular.module('ngpoli').service('govTrackService', govTrackService);
    }
