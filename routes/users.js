"use strict";
var express = require("express");
var Users_1 = require("../models/Users");
var GovItems_1 = require("../models/GovItems");
var router = express.Router();
function createNotification(oldGovItem, newGovItem) {
    var msg = null;
    if (oldGovItem["type"] === 'bill') {
        if (oldGovItem["data"].current_status_date !== newGovItem["data"].current_status_date) {
            msg = newGovItem["data"].current_status_description;
        }
    }
    return msg;
}
function updateUser(user, _res) {
    console.log("updating user");
    Users_1.default.update({ _id: user._id }, user).then(function (_user) {
        _res.json(user);
    }).catch(function (err) {
        _res.status(400).json(err);
    });
}
function updateGovItems(govItem, user) {
    GovItems_1.default.findOne({ govId: govItem.govId }).then(function (item) {
        if (item == null) {
            GovItems_1.default.create(govItem);
        }
    }).catch(function (e) { throw new Error(e); });
}
router.post('/register', function (req, res) {
    Users_1.default.findOne({ username: req.body.username }).then(function (user) {
        if (user === null) {
            var user_1 = new Users_1.default();
            user_1.username = req.body.username;
            user_1.password = req.body.password;
            user_1.starredItems = req.body.starredItems;
            user_1.notifications = req.body.notifications;
            Users_1.default.create(user_1).then(function (newUser) {
                res.json(newUser);
            }).catch(function (e) { res.status(500).json(e); });
        }
        else {
            res.status(400).send('dupe');
        }
    }).catch(function (err) {
        res.status(500).send(err);
    });
});
router.post('/login', function (req, res) {
    Users_1.default.findOne({ username: req.body.username }).then(function (user) {
        if (!user) {
            res.status(404);
        }
        else {
            res.json(user);
        }
    }).catch(function () {
        res.sendStatus(404).json('no user');
    });
});
function checkforNotification(newItem, user, res) {
    console.log("checking notis");
    GovItems_1.default.findOne({ govId: newItem.govId }).then(function (item) {
        console.log("found some existing govitem, item is null? ", item == null);
        if (item != null) {
            var notification = createNotification(item, newItem);
            console.log(notification);
            if (notification) {
                user.notifications.push(notification);
                console.log("about to update: ", user._id);
                Users_1.default.update({ _id: user._id }, user).then(function () {
                    console.log("some update");
                    updateUser(user, res);
                }).catch(function (e) { throw new Error(e); });
            }
            else {
                console.log("no notifications");
                updateUser(user, res);
            }
        }
        else {
            GovItems_1.default.create(newItem).then(function () {
                updateUser(user, res);
            }).catch(function (e) { throw new Error(e); });
        }
    }).catch(function (e) { throw new Error(e); });
}
router.post('/update/:id', function (req, res) {
    var id = req.params.id;
    var govItem = req.body["govItem"];
    Users_1.default.findOne({ _id: id }).then(function (_user) {
        var user = _user;
        user.username = req.body.username;
        user.password = req.body.password;
        user.starredItems = req.body.starredItems;
        user.notifications = req.body.notifications || [];
        if (govItem) {
            checkforNotification(govItem, user, res);
        }
        else {
            updateUser(user, res);
        }
    }).catch(function (err) {
        res.sendStatus(404).json('no user');
    });
});
router.get('/notifications/:id', function (req, res) {
    var id = req.params.id;
    Users_1.default.findOne({ _id: id }).then(function (_user) {
        if (_user["notifications"].length) {
            res.json(_user["notifications"]);
        }
        else {
            res.json([]);
        }
    }).catch(function (err) {
        res.sendStatus(404).json('no user');
    });
});
router.get('/visitorView/:username', function (req, res) {
    var username = req.params.username;
    Users_1.default.findOne({ username: username }).then(function (_user) {
        res.json(_user);
    }).catch(function (err) {
        res.sendStatus(404).json('no user');
    });
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = router;
