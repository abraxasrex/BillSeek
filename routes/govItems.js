"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var GovItems_1 = require("../models/GovItems");
var Users_1 = require("../models/Users");
var router = express.Router();
router.get('/:id/:type', function (req, res, next) {
    GovItems_1.default.findOne({ govId: req.params.id, type: req.params.type }).then(function (govItem) {
        console.log(req.params);
        res.send(govItem);
    }).catch(function (e) { throw new Error; });
});
router.post('/:id', function (req, res, next) {
    GovItems_1.default.findOne({ govId: req.params.id, type: req.body.type }).then(function (govItem) {
        if (govItem == null) {
            GovItems_1.default.create(req.body).then(function (item) {
                res.json(item);
            });
        }
        else {
            res.send(500);
        }
    }).catch(function (err) {
        res.sendStatus(504);
    });
});
function cleanGovItems() {
    GovItems_1.default.find().then(function (items) {
        items.forEach(function (item) {
            Users_1.default.findOne(function (user) {
                if (user == null) {
                    GovItems_1.default.remove({ _id: item._id });
                }
            });
        });
        setTimeout(cleanGovItems, 100000);
        console.log('cleaned.');
    });
}
cleanGovItems();
exports.default = router;
