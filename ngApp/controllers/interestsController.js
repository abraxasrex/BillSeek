var ngpoli;
(function (ngpoli) {
    var Controllers;
    (function (Controllers) {
        var InterestsController = (function () {
            function InterestsController(UserService, govTrackService, localStore, $stateParams, $state) {
                var _this = this;
                this.UserService = UserService;
                this.govTrackService = govTrackService;
                this.localStore = localStore;
                this.$stateParams = $stateParams;
                this.$state = $state;
                this.starredItems = [];
                this.notifications = [];
                if (this.localStore.isLoggedIn()) {
                    localStore.loadUser(this);
                    if (!this.$state.params["username"]) {
                        var data = this.$state.get("main.account").data;
                        UserService.loadNotifications(data).then(function (notifications) {
                            _this.notifications = notifications;
                        }).catch(function (e) { throw new Error(e); });
                    }
                    else {
                        this.visitorView();
                    }
                }
                else {
                    this.visitorView();
                }
            }
            InterestsController.prototype.visitorView = function () {
                var _this = this;
                var currentUserName = this.$stateParams["username"];
                this.UserService.visitorView(this.$stateParams["username"]).then(function (results) {
                    _this.visitorPopulate(results);
                }).catch(function (e) { throw new Error(e); });
            };
            InterestsController.prototype.visitorPopulate = function (user) {
                var _this = this;
                this.starredItems = [];
                this.notifications = [];
                user.starredItems.forEach(function (star) {
                    _this.govTrackService.getOne(star).then(function (result) {
                        _this.starredItems.push(result);
                    });
                });
                this.notifications = user.notifications;
            };
            InterestsController.prototype.list = function () {
                var _this = this;
                this.starredItems = [];
                var stars = this.$state.get('main.account').data["starredItems"] || [];
                stars.forEach(function (star) {
                    _this.govTrackService.getOne(star).then(function (result) {
                        _this.starredItems.push(result);
                    });
                });
                this.notifications = this.$state.get('main.account').data["notifications"];
            };
            InterestsController.prototype.deNotify = function (notification) {
                var user = this.$state.get('main.account').data;
                user.notifications.splice(user.notifications.indexOf(notification), 1);
                this.$state.get('main.account').data = user;
                this.notifications = user.notifications;
                this.UserService.update(user);
            };
            InterestsController.prototype.removeItem = function (item) {
                var _this = this;
                var user = this.$state.get('main.account').data;
                var stars = user["starredItems"];
                var starIds = stars.map(function (star) { return star.id; });
                var idx = starIds.indexOf(item["id"]);
                user["starredItems"].splice(idx, 1);
                this.UserService.update(user).then(function (_user) {
                    _this.localStore.cache(_user);
                    _this.$state.get('main.account').data = _user;
                    _this.list();
                });
            };
            return InterestsController;
        }());
        Controllers.InterestsController = InterestsController;
    })(Controllers = ngpoli.Controllers || (ngpoli.Controllers = {}));
})(ngpoli || (ngpoli = {}));
