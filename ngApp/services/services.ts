namespace ngpoli.Services {
    const govTrackApi = 'https://www.govtrack.us/api/v2/:type/?order_by=:filter&:q&:options';
    const findOneApi = 'https://www.govtrack.us/api/v2/:type/:id';
    const labelApi = '/api/labels';
    const billFilter = '-current_status_date';
    const peopleFilter = 'sortname';
    const roleFilter = 'senator_class';
    const dateQ = '&current_status_date__gt=';
    export class govTrackService {
      public govTrackResource;
      public findOneResource;
      constructor($resource: ng.resource.IResourceService){
        this.govTrackResource = $resource(govTrackApi, {q: 'q', type:'@type', filter: '@filter', options:'options'});
        //this.findOneResource = $resource(findOneApi, {id: '@id', type:'@type'});
        this.findOneResource = $resource('/api/govItems/:id/:type', {id: 'id', type: 'type'});
      }
      // clean up GET search
      public get(search){
        console.log('received search for: ', search);
        let _search = {};
        _search['type'] = search.type;
        _search['options'] = null;
        search["query"] ? _search['q'] = "q=" + search["query"] : _search['q'] = null;
        // if(search.query && (search.query.length && search.query.length < 1)){
        //   _search['q'] = 'q=' + search.query;
        // }
        if(search.options && search.options.length){
          _search['options'] = search.options;
        }
        if(search.options == 'role_type=representative' || search.options == 'role_type=senator' || search.options == 'all_people'){
          _search['type']='role';
        }
        if(search.filter && search.filter.length && search.type !== 'role'){
          _search['filter'] = search.filter;
        }
        if(search.type == 'bill'){
          _search['filter'] = billFilter;
        //  _search['q'] = 'q=all';
          _search['options'] = dateQ + search["date"].toISOString();
        }
        if(_search['type'] == 'person'){
          _search['filter'] = peopleFilter;
        }
        if(_search['options'] == 'all_people'){
          _search["options"] = '';
        }
        if(_search['type'] == 'role'){
          _search['filter'] = roleFilter;
          _search['options'] = _search['options'] + '&current=true';
        }
        console.log('sending req to govtrack: ', _search);
        return this.govTrackResource.get(_search).$promise;
      }
      public getOne(search){
        let _search = {id: search.id, type:search.type};
      //  return this.findOneResource.get(search).$promise;
      return this.findOneResource.get(_search).$promise;
      }
    }

    export class appApiService {
      public labelResource;
      constructor($resource: ng.resource.IResourceService,
      private $state: ng.ui.IStateService){
        this.labelResource = $resource(labelApi + '/:pw', {name:'@pw'});
      }
      public getLabels(){
        let pw = this.$state.get('main.account').data.password;
        return this.labelResource.query({pw:pw}).$promise;
      }
      public postLabel (label){
       let pw = this.$state.get('main.account').data.password;
       return this.labelResource.save({pw:pw}, label).$promise;
      }
      public removeLabel(label){
        let pw = this.$state.get('main.account').data.password;
        return this.labelResource.remove({pw:pw}, label).$promise;
      }
    }
    export class localStore {
      constructor(){}
      public isLoggedIn(){
        let currentStorage = localStorage.getItem('bs_user');
        if(!currentStorage || currentStorage.length < 3){
          localStorage.setItem('bs_user', JSON.stringify({}));
          return false;
        } else {
          return true;
        }
      }
      public loadUser(_this){
         let loggedIn = _this.localStore.isLoggedIn();
          if(loggedIn){
            _this.$state.get('main.account').data = _this.localStore.bootstrap();
            _this.list();
          } else {
            _this.openDialog();
          }
      }
      public loadUserForMain(_this){
         let loggedIn = _this.localStore.isLoggedIn();
          if(loggedIn){
            _this.$state.get('main.account').data = _this.localStore.bootstrap();
          //  _this.list();
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
