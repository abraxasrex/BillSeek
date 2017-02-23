"use strict";
var DialogController = (function () {
    function DialogController($scope, $mdDialog) {
        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this.postLabel = this.postLabel;
    }
    return DialogController;
}());
exports.DialogController = DialogController;
var TagsController = (function () {
    function TagsController(appApiService, $mdDialog, $scope) {
        this.appApiService = appApiService;
        this.$mdDialog = $mdDialog;
        this.$scope = $scope;
        this.newLabel = {};
        this.editLabel = {};
        this.labelToDelete = {};
        this.getLabels();
    }
    TagsController.prototype.postLabel = function (label) {
        var _this = this;
        this.appApiService.postLabel(label).then(function (results) {
            _this.labels = results.data;
            _this.newLabel = {};
        });
    };
    TagsController.prototype.getLabels = function () {
        var _this = this;
        this.appApiService.getLabels().then(function (results) {
            _this.labels = results;
        });
    };
    TagsController.prototype.removeLabel = function (label) {
        var _this = this;
        this.appApiService.removeLabel(label).then(function (results) {
            _this.labels = results.data;
        });
    };
    TagsController.prototype.openDialog = function (label) {
        var _this = this;
        var vm = this.$scope;
        this.editLabel = label;
        this.$mdDialog.show({
            scope: vm,
            preserveScope: true,
            controller: DialogController,
            templateUrl: 'dialog1.tmpl.html',
            clickOutsideToClose: true
        })
            .then(function () {
            _this.postLabel(_this.editLabel);
        }, function () {
            _this.editLabel = {};
        });
    };
    TagsController.prototype.cancelEdit = function () {
        this.$mdDialog.cancel();
    };
    TagsController.prototype.submitEdit = function () {
        this.$mdDialog.hide();
    };
    return TagsController;
}());
exports.TagsController = TagsController;
