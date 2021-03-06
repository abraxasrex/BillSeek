import * as express from 'express';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as ejs from 'ejs';
import * as mongoose from 'mongoose';
import User from './models/Users';
let MONGO_URI = 'mongodb://jbr:jbr@ds157487.mlab.com:57487/billseek';
let TEST_URI = 'mongodb://jbr:jbr@ds013966.mlab.com:13966/billseek-test';


//uncomment to test
//MONGO_URI = TEST_URI;

//fix mongoose promise depredation
//mongoose["Promise"]  = global.Promise;

// empty db seed: check entries
mongoose.connect(MONGO_URI).then(()=>{
  console.log('mongoose connected.');
  User.find({username: 'helloman'}).then((users)=>{
    console.log('users!', users);
  });

  // User.create([
  //   {username: 'xxxxxxxxx', password: 'xxxxxxxxx'},
  //   {username: 'yxxxxxxxx', password: 'yxxxxxxxx'}
  // ]).then(()=>{
  //   console.log('success')
  // }).catch((err)=>{
  //     console.log(err);
  //   });

}).catch((err)=>{
  console.log('mongoose error.');
});

import users from './routes/users';
import govItems from './routes/govItems';

let app = express();

// VIEWS:
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));

app.use('/ngApp', express.static(path.join(__dirname, 'ngApp')));
app.use('/vrApp', express.static(path.join(__dirname, 'vrApp')));

app.use('/api', express.static(path.join(__dirname, 'api')));
app.use('/api/govItems', govItems);
app.use('/api/users', users);

app.use('/static_assets', express.static(path.join(__dirname, './static_assets')));
app.use('/build', express.static(path.join(__dirname, 'vr/build')));
// redirect 404 to home for the sake of AngularJS client-side routes

// app.get('/favicon.ico', function(req, res) {
//     res.send(204);
// });


//conditional routing for both hosted apps.
app.get('/*', function(req, res, next) {
  console.log('request path. ', req.path);
  if(/.ico/.test(req.path)){
    return next({status: 204});
  }
   if (/.js|.html|.css|templates|js|scripts/.test(req.path) || req.xhr) {
      return next({ status: 404, message: 'Not Found' });
   } else {
      if(/VirtualBreakfast/.test(req.path)){
        return res.render('vrIndex');
      } else if(/BillSeek/.test(req.path)){
        return res.render('index');
      } else if(/VirtualReaction/.test(req.path)){
        return res.sendFile(path.join(__dirname, './vr', 'index.html'));
      } else {
        console.log('mmm wat? ');
      }
    }
});


// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err['status'] = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err:Error, req, res, next) => {
    res.status(err['status'] || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err:Error, req, res, next) => {
  res.status(err['status'] || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

export = app;
