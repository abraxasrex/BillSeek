namespace ngpoli.Services {
    let targetUrl = 'https://www.govtrack.us/api/v2/bill?';

    export class govTrackService {
      public govTrackResource;
      constructor($resource: ng.resource.IResourceService){
        this.govTrackResource = $resource(targetUrl);
      }
      public govTrackFetch(){
        return this.govTrackResource;
      }
    }
      angular.module('ngpoli').service('govTrackService', govTrackService);
    }
