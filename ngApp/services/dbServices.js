var ngpoli;
(function (ngpoli) {
    var dbServices;
    (function (dbServices) {
        var UserService = (function () {
            function UserService($resource) {
                this.NotificationResource = $resource('/api/users/notifications/:id');
                this.UserResource = $resource('/api/users/:id');
                this.LoginResource = $resource('/api/users/login');
                this.RegisterResource = $resource('/api/users/register');
                this.UpdateResource = $resource('/api/users/update/:id');
                this.VisitorViewResource = $resource('/api/users/visitorView/:username');
            }
            UserService.prototype.get = function (id) {
                return this.UserResource.get({ id: id }).$promise;
            };
            UserService.prototype.list = function () {
                return this.UserResource.query().$promise;
            };
            UserService.prototype.save = function (user) {
                return this.UserResource.save({ id: user._id }, user).$promise;
            };
            UserService.prototype.login = function (user) {
                return this.LoginResource.save(user).$promise;
            };
            UserService.prototype.register = function (user) {
                return this.RegisterResource.save(user).$promise;
            };
            UserService.prototype.remove = function (user) {
                return this.UserResource.remove({ id: user._id }, user).$promise;
            };
            UserService.prototype.update = function (user) {
                console.log('user: ', user);
                return this.UpdateResource.save({ id: user._id }, user).$promise;
            };
            UserService.prototype.loadNotifications = function (user) {
                return this.NotificationResource.query({ id: user._id }).$promise;
            };
            UserService.prototype.visitorView = function (username) {
                return this.VisitorViewResource.get({ username: username }).$promise;
            };
            return UserService;
        }());
        dbServices.UserService = UserService;
        var GovTrackService = (function () {
            function GovTrackService($resource) {
                this.GovResource = $resource('/api/govItems/:id');
            }
            GovTrackService.prototype.get = function (id) {
                return this.GovResource.get({ id: id }).$promise;
            };
            GovTrackService.prototype.list = function () {
                return this.GovResource.query().$promise;
            };
            GovTrackService.prototype.save = function (govItem) {
                return this.GovResource.save({ id: govItem._id }, govItem).$promise;
            };
            GovTrackService.prototype.remove = function (govItem) {
                return this.GovResource.remove({ id: govItem._id }, govItem).$promise;
            };
            return GovTrackService;
        }());
        dbServices.GovTrackService = GovTrackService;
        angular.module('ngpoli').service('UserService', UserService);
        angular.module('ngpoli').service('GovTrackService', GovTrackService);
    })(dbServices = ngpoli.dbServices || (ngpoli.dbServices = {}));
})(ngpoli || (ngpoli = {}));
