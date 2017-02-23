var ngpoli;
(function (ngpoli) {
    var Services;
    (function (Services) {
        var govTrackApi = 'https://www.govtrack.us/api/v2/:type/?order_by=:filter&:q&:options';
        var findOneApi = 'https://www.govtrack.us/api/v2/:type/:id';
        var labelApi = '/api/labels';
        var billFilter = '-current_status_date';
        var peopleFilter = 'sortname';
        var roleFilter = 'senator_class';
        var dateQ = '&current_status_date__gt=';
        var govTrackService = (function () {
            function govTrackService($resource) {
                this.govTrackResource = $resource(govTrackApi, { q: 'q', type: '@type', filter: '@filter', options: 'options' });
                this.findOneResource = $resource('/api/govItems/:id/:type', { id: 'id', type: 'type' });
            }
            govTrackService.prototype.get = function (search) {
                console.log('received search for: ', search);
                var _search = {};
                _search['type'] = search.type;
                _search['options'] = null;
                search["query"] ? _search['q'] = "q=" + search["query"] : _search['q'] = null;
                if (search.options && search.options.length) {
                    _search['options'] = search.options;
                }
                if (search.options == 'role_type=representative' || search.options == 'role_type=senator' || search.options == 'all_people') {
                    _search['type'] = 'role';
                }
                if (search.filter && search.filter.length && search.type !== 'role') {
                    _search['filter'] = search.filter;
                }
                if (search.type == 'bill') {
                    _search['filter'] = billFilter;
                    _search['options'] = dateQ + search["date"].toISOString();
                }
                if (_search['type'] == 'person') {
                    _search['filter'] = peopleFilter;
                }
                if (_search['options'] == 'all_people') {
                    _search["options"] = '';
                }
                if (_search['type'] == 'role') {
                    _search['filter'] = roleFilter;
                    _search['options'] = _search['options'] + '&current=true';
                }
                console.log('sending req to govtrack: ', _search);
                return this.govTrackResource.get(_search).$promise;
            };
            govTrackService.prototype.getOne = function (search) {
                var _search = { id: search.id, type: search.type };
                return this.findOneResource.get(_search).$promise;
            };
            return govTrackService;
        }());
        Services.govTrackService = govTrackService;
        var appApiService = (function () {
            function appApiService($resource, $state) {
                this.$state = $state;
                this.labelResource = $resource(labelApi + '/:pw', { name: '@pw' });
            }
            appApiService.prototype.getLabels = function () {
                var pw = this.$state.get('main.account').data.password;
                return this.labelResource.query({ pw: pw }).$promise;
            };
            appApiService.prototype.postLabel = function (label) {
                var pw = this.$state.get('main.account').data.password;
                return this.labelResource.save({ pw: pw }, label).$promise;
            };
            appApiService.prototype.removeLabel = function (label) {
                var pw = this.$state.get('main.account').data.password;
                return this.labelResource.remove({ pw: pw }, label).$promise;
            };
            return appApiService;
        }());
        Services.appApiService = appApiService;
        var localStore = (function () {
            function localStore() {
            }
            localStore.prototype.isLoggedIn = function () {
                var currentStorage = localStorage.getItem('bs_user');
                if (!currentStorage || currentStorage.length < 3) {
                    localStorage.setItem('bs_user', JSON.stringify({}));
                    return false;
                }
                else {
                    return true;
                }
            };
            localStore.prototype.loadUser = function (_this) {
                var loggedIn = _this.localStore.isLoggedIn();
                if (loggedIn) {
                    _this.$state.get('main.account').data = _this.localStore.bootstrap();
                    _this.list();
                }
                else {
                    _this.openDialog();
                }
            };
            localStore.prototype.loadUserForMain = function (_this) {
                var loggedIn = _this.localStore.isLoggedIn();
                if (loggedIn) {
                    _this.$state.get('main.account').data = _this.localStore.bootstrap();
                }
            };
            localStore.prototype.bootstrap = function () {
                return JSON.parse(localStorage.getItem('bs_user'));
            };
            localStore.prototype.cache = function (userData) {
                return localStorage.setItem('bs_user', JSON.stringify(userData));
            };
            localStore.prototype.clearStore = function () {
                return localStorage.setItem('bs_user', JSON.stringify({}));
            };
            return localStore;
        }());
        Services.localStore = localStore;
        angular.module('ngpoli').service('govTrackService', govTrackService);
        angular.module('ngpoli').service('appApiService', appApiService);
        angular.module('ngpoli').service('localStore', localStore);
    })(Services = ngpoli.Services || (ngpoli.Services = {}));
})(ngpoli || (ngpoli = {}));
