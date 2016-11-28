namespace ngpoli.Services {
    const govTrackApi = 'https://www.govtrack.us/api/v2/:type/?order_by=:filter&q=:q';
    const labelApi = '/api/labels';
    const billFilter = '-current_status_date';
    const peopleFilter = 'sortname';

    export class govTrackService {
      public govTrackResource;
      constructor($resource: ng.resource.IResourceService){
        this.govTrackResource = $resource(govTrackApi, {q: '@q', type:'@type', filter: '@filter'});
      }
      public get(q, type){
        let _q = q;
        let filter;
        if(!q || (q.length && q.length < 1)){
          _q = 'all';
        }
        type == 'bill' ? filter = billFilter : filter = peopleFilter;
        return this.govTrackResource.get({q: _q, type:type, filter: filter}).$promise;
      }
    }

    export class appApiService {
      public labelResource;
      constructor($resource: ng.resource.IResourceService,
      private $state: ng.ui.IStateService){
        this.labelResource = $resource(labelApi + '/:pw', {name:'@pw'});
      }
      public getLabels(){
        let pw = this.$state.get('account').data.password;
        return this.labelResource.query({pw:pw}).$promise;
      }
      public postLabel (label){
       let pw = this.$state.get('account').data.password;
       return this.labelResource.save({pw:pw}, label).$promise;
      }
      public removeLabel(label){
        let pw = this.$state.get('account').data.password;
        return this.labelResource.remove({pw:pw}, label).$promise;
      }
    }
    export class localStore {
      constructor(){

      }
      public isLoggedIn(){
        let currentStorage = localStorage.getItem('bs_user');
        console.log('currentStorage: ', currentStorage);
        if(!currentStorage || currentStorage.length < 3){
          localStorage.setItem('bs_user', JSON.stringify({}));
          return false;
        } else {
          return true;
        }
      }
      public bootstrap(){
        return JSON.parse(localStorage.getItem('bs_user'));
      }
      public cache(userData){
        return localStorage.setItem('bs_user', JSON.stringify(userData));
      }
      public clearStore(){
        return localStorage.setItem('bs_user', JSON.stringify({}));
      }
    }
      angular.module('ngpoli').service('govTrackService', govTrackService);
      angular.module('ngpoli').service('appApiService', appApiService);
      angular.module('ngpoli').service('localStore', localStore);
    }
