namespace ngpoli.Services {
    const govTrackApi = 'https://www.govtrack.us/api/v2/:type/?order_by=:filter&:q&:options';
    const labelApi = '/api/labels';
    const billFilter = '-current_status_date';
    const peopleFilter = 'sortname';
    const roleFilter = 'senator_class';
    const dateQ = '&current_status_date__gt=';
    export class govTrackService {
      public govTrackResource;
      constructor($resource: ng.resource.IResourceService){
        this.govTrackResource = $resource(govTrackApi, {q: 'q', type:'@type', filter: '@filter', options:'options'});
      }
      public get(search){
        console.log('received search for: ', search);
        let _search = {};
        _search['type'] = search.type;
        _search['options'] = null;
        _search['q'] = null;
        if(search.query && (search.query.length && search.query.length < 1)){
          _search['q'] = 'q=' + search.query;
        }
        if(search.options && search.options.length){
          _search['options'] = search.options;
        }
        if(search.options == 'role_type=representative' || search.options == 'role_type=senator' || search.options == 'all_people'){
          _search['type']='role';
          console.log('set role');
        }
        if(search.filter && search.filter.length && search.type !== 'role'){
          _search['filter'] = search.filter;
        }
        if(search.type == 'bill'){
          _search['filter'] = billFilter;
          _search['q'] = 'q=all';
        //  _search['options'] = _search['options'] + '&current_status_date__gt=' + search["date"].toISOString();
          _search['options'] = dateQ + search["date"].toISOString();
        }
        if(_search['type'] == 'person'){
          _search['filter'] = peopleFilter;
        }
        if(_search['type'] == 'role'){
          _search['filter'] = roleFilter;
            console.log("ingoing search options: " + search["options"]);
          console.log("outgoing search options: " + _search["options"]);
          _search['options'] = _search['options'] + '&current=true';
        }
        if(_search['options'] == 'all_people'){
          _search["options"] = null;
        }
          console.log('query is: ', _search);
        return this.govTrackResource.get(_search).$promise;
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
