"use strict";
var debug = require('debug')('myapp:server');
var http = require('http');
var express = require("express");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Users_1 = require("../models/Users");
var GovItems_1 = require("../models/GovItems");
var MONGO_URI = 'mongodb://jbr:jbr@ds013966.mlab.com:13966/billseek-test';
var chai = require("chai");
var chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);
mongoose.connect(MONGO_URI).then(function () {
    console.log('mongoose connected.');
}).catch(function (err) {
    console.log('mongoose error.');
});
var users_1 = require("../routes/users");
var govItems_1 = require("../routes/govItems");
var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('../api', express.static(path.join(__dirname, 'api')));
app.use('../api/govItems', govItems_1.default);
app.use('../api/users', users_1.default);
app.get('/*', function (req, res, next) {
    if (/.js|.html|.css|templates|js|scripts/.test(req.path) || req.xhr) {
        return next({ status: 404, message: 'Not Found' });
    }
    else {
        return res.render('index');
    }
});
app.set('port', process.env.PORT || '3000');
var server = app.listen(app.get('port'), function () {
    console.log('listening on port 5000 or another environment.');
});
var sampleUser = {
    username: 'testing123',
    password: 'testing456',
    starredItems: ['01234', '56789'],
    notifications: []
};
var sampleGovItem = {
    type: 'bill',
    apiLocation: 'sampleApi',
    govId: 'sampleId',
    data: {
        current_status_description: 'old description',
        current_status_date: '123'
    }
};
var userSeed;
var govItemSeed;
describe('GovItems', function () {
    beforeEach(function (done) {
        GovItems_1.default.remove({}, function (err) {
            GovItems_1.default.create(sampleGovItem).then(function () {
                GovItems_1.default.findOne().then(function (item) {
                    govItemSeed = item;
                    done();
                });
            }).catch(function (err) { throw new Error(err); });
        });
    });
    beforeEach(function (done) {
        Users_1.default.remove({}, function (err) {
            Users_1.default.create(sampleUser).then(function () {
                Users_1.default.findOne().then(function (user) {
                    userSeed = user;
                    done();
                });
            }).catch(function (err) { throw new Error(err); });
        });
    });
    describe('/POST existing user should not return 404', function () {
        it('it should not return status 404', function (done) {
            var userPayload = userSeed;
            userPayload["govItem"] = govItemSeed;
            chai.request(server)
                .post('/api/users/update/' + userPayload._id)
                .send(userPayload)
                .end(function (err, res) {
                setTimeout(function () {
                    res.should.not.have.status(404);
                    done();
                }, 5000);
            });
        });
    });
});
