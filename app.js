"use strict";
var express = require("express");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Users_1 = require("./models/Users");
var MONGO_URI = 'mongodb://jbr:jbr@ds157487.mlab.com:57487/billseek';
var TEST_URI = 'mongodb://jbr:jbr@ds013966.mlab.com:13966/billseek-test';
mongoose.connect(MONGO_URI).then(function () {
    console.log('mongoose connected.');
    Users_1.default.find({ username: 'helloman' }).then(function (users) {
        console.log('users!', users);
    });
}).catch(function (err) {
    console.log('mongoose error.');
});
var users_1 = require("./routes/users");
var govItems_1 = require("./routes/govItems");
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));
app.use('/ngApp', express.static(path.join(__dirname, 'ngApp')));
app.use('/vrApp', express.static(path.join(__dirname, 'vrApp')));
app.use('/api', express.static(path.join(__dirname, 'api')));
app.use('/api/govItems', govItems_1.default);
app.use('/api/users', users_1.default);
app.get('/*', function (req, res, next) {
    console.log('request path. ', req.path);
    if (/.ico/.test(req.path)) {
        return next({ status: 204 });
    }
    if (/.js|.html|.css|templates|js|scripts/.test(req.path) || req.xhr) {
        return next({ status: 404, message: 'Not Found' });
    }
    else {
        if (/VirtualBreakfast/.test(req.path)) {
            return res.render('vrIndex');
        }
        else if (/BillSeek/.test(req.path)) {
            return res.render('index');
        }
        else {
            console.log('mmm wat? ');
        }
    }
});
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
app.use(function (err, req, res, next) {
    res.status(err['status'] || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
module.exports = app;
