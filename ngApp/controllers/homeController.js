var ngpoli;
(function (ngpoli) {
    var Controllers;
    (function (Controllers) {
        var HomeController = (function () {
            function HomeController(UserService, govTrackService, $mdDialog, $state, localStore, $scope) {
                this.UserService = UserService;
                this.govTrackService = govTrackService;
                this.$mdDialog = $mdDialog;
                this.$state = $state;
                this.localStore = localStore;
                this.$scope = $scope;
                this.search = { date: new Date() };
                this.date = new Date();
                this.billTypes = [
                    'all',
                    'house_resolution',
                    'senate_bill',
                    'senate_joint_resolution',
                    'house_bill',
                    'house_concurrent_resolution',
                    'senate_concurrent_resolution',
                    'house_joint_resolution',
                    'senate_resolution'
                ];
                this.isNewUser = false;
                var billDate = new Date();
                this.search['date'] = billDate.toISOString();
                billDate.setMonth(billDate.getMonth() - 6);
                this.search = { type: 'bill', query: '', options: '', filter: '', date: billDate };
                this.billOptions = 'current_status=prov_kill_veto';
                this.personOptions = 'all_people';
                localStore.loadUser(this);
                this.loadingChange = false;
            }
            HomeController.prototype.openDialog = function () {
                var _this = this;
                var vm = this.$scope;
                this.$mdDialog.show({
                    scope: vm,
                    preserveScope: true,
                    controller: Controllers.HomeDialog,
                    templateUrl: 'dialog2.tmpl.html',
                    clickOutsideToClose: false
                }).then(function () {
                    _this.$state.go('main.home', null, { reload: true });
                }, function () { });
            };
            HomeController.prototype.trySubmit = function (isNew, user) {
                var authType;
                isNew ? authType = 'register' : authType = 'login';
                this.tryAuth(user, authType);
            };
            HomeController.prototype.setUser = function (user) {
                console.log("user setuser: ", user);
                this.localStore.cache(user);
                this.$state.get('main.account').data = user;
                this.$mdDialog.hide();
            };
            HomeController.prototype.tryAuth = function (user, type) {
                var _this = this;
                this.UserService[type](user).then(function (result) {
                    _this.setUser(result);
                }).catch(function (err) {
                    if (err.data == 'dupe') {
                        alert('duplicate user!');
                    }
                    if (err.data == 'Not Found') {
                        alert('user not found! make sure your username and password is correct.');
                    }
                });
            };
            HomeController.prototype.list = function () {
                var _this = this;
                this.feedItems = [];
                this.loadingChange = true;
                var _search = this.search;
                if (_search["type"] == 'person') {
                    _search["options"] = this.personOptions;
                    _search["query"] = null;
                }
                else {
                    _search["options"] = this.billOptions;
                }
                this.govTrackService.get(_search).then(function (results) {
                    console.log('RESULTTTTTS: ', results);
                    if (_search["type"] !== 'bill') {
                        _this.cleanPeopleFilter(results.objects);
                    }
                    else {
                        _this.feedItems = results.objects;
                    }
                    _this.setStars();
                    _this.loadingChange = false;
                }).catch(function (err) {
                    _this.loadingChange = false;
                    console.log(err);
                });
            };
            HomeController.prototype.cleanPeopleFilter = function (people) {
                var _this = this;
                var names = [];
                var copy = people;
                people.forEach(function (obj) {
                    names.push(obj.person.name);
                    if (names.indexOf(obj.person.name) || names.indexOf(obj.person.sortname)) {
                        copy.splice(copy.indexOf(obj), 1);
                    }
                });
                setTimeout(function () {
                    _this.feedItems = copy;
                    _this.$scope.$apply();
                }, 1200);
            };
            HomeController.prototype.setStars = function () {
                this.$state.get('main.account').data.starredItems = [];
                var user = this.$state.get('main.account').data;
                console.log("setstars user: ", user);
                if (user["starredItems"] && user["starredItems"].length) {
                    var stars_1 = user.starredItems.map(function (star) {
                        return star["id"];
                    });
                    this.feedItems.forEach(function (item) {
                        var match = stars_1.indexOf(item.id);
                        match > -1 ? item.starred = true : item.starred = false;
                    });
                }
                else {
                    this.$state.get('main.account').data.starredItems = [];
                }
            };
            HomeController.prototype.rateItem = function (item) {
                var _this = this;
                item.starred = !item.starred;
                var user = this.$state.get('main.account').data;
                console.log("rateitem user: ", user);
                var stars = [];
                var type;
                if (item["person"]) {
                    type = 'role';
                }
                if (item["current_status_description"]) {
                    type = 'bill';
                }
                if (user.starredItems && user.starredItems.length) {
                    stars = user.starredItems;
                    var starIds = stars.map(function (star) {
                        return star.id;
                    });
                    var _match = starIds.indexOf(item.id);
                    if (_match > -1) {
                        stars.splice(_match, 1);
                    }
                    else {
                        stars.push({ id: item.id, type: type });
                    }
                }
                else {
                    stars.push({ id: item.id, type: type });
                }
                user.starredItems = stars;
                this.$state.get('main.account').data = user;
                console.log("rateitem user: ", user);
                this.localStore.cache(user);
                console.log("rateitem user: ", user);
                var _item = {
                    type: type,
                    apiLocation: item["link"],
                    data: item,
                    govId: item["id"]
                };
                if (_item.type != 'bill') {
                    _item.type = 'role';
                    _item.apiLocation = _item.data["person"]["link"];
                }
                else {
                    _item.type = 'bill';
                }
                user["govItem"] = _item;
                console.log("rateitem user: ", user);
                this.UserService.update(user).then(function (_user) {
                    console.log("response user:", _user);
                    _this.localStore.cache(_user);
                    _this.$state.get('main.account').data = _user;
                    _this.setStars();
                }).catch(function (e) { throw new Error(e); });
            };
            return HomeController;
        }());
        Controllers.HomeController = HomeController;
    })(Controllers = ngpoli.Controllers || (ngpoli.Controllers = {}));
})(ngpoli || (ngpoli = {}));
