
//
var debug = require('debug')('myapp:server');
var http = require('http');
//
import * as express from 'express';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as ejs from 'ejs';
import * as mongoose from 'mongoose';
import User from '../models/Users';
import GovItem from '../models/GovItems';
const MONGO_URI = 'mongodb://jbr:jbr@ds013966.mlab.com:13966/billseek-test';

// TEST modules //
import * as chai from 'chai';
import {} from 'mocha';
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);


// empty db seed: check entries
mongoose.connect(MONGO_URI).then(()=>{
  console.log('mongoose connected.');
}).catch((err)=>{
  console.log('mongoose error.');
});

import users from '../routes/users';
import govItems from '../routes/govItems';

let app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));
// app.use('/ngApp', express.static(path.join(__dirname, 'ngApp')));
app.use('../api', express.static(path.join(__dirname, 'api')));

app.use('../api/govItems', govItems);
app.use('../api/users', users);

// redirect 404 to home for the sake of AngularJS client-side routes
app.get('/*', function(req, res, next) {
  if (/.js|.html|.css|templates|js|scripts/.test(req.path) || req.xhr) {
    return next({ status: 404, message: 'Not Found' });
  } else {
    return res.render('index');
  }
});


/**
 * Get port from environment and store in Express.
 */


 app.set('port', process.env.PORT || '3000');

 var server = app.listen(app.get('port'), function() {
   console.log('listening on port 5000 or another environment.');
 });

 //let sampleId1 = '56cb91bdc3464f14678934ca';
 //let sampleId2 = '56cb91bdc3464f14678934cb';
 let sampleUser = {
   //  _id: new mongoose.mongo["ObjectId"](sampleId1),
     // username: string,
     username: 'testing123',
     // password: string,
     password: 'testing456',
     // starredItems: string [],
     starredItems: ['01234', '56789'],
     // notifications: string []
     notifications: []
 };

 let sampleGovItem = {
  // _id: new mongoose.mongo["ObjectId"](sampleId2),
   // type:string,
   type: 'bill',
   // apiLocation: string
   apiLocation: 'sampleApi',
   // govId: string
   govId : 'sampleId',

   data: {
     current_status_description: 'old description',
     current_status_date: '123'
   }

 };


let userSeed;
let govItemSeed;
  describe('GovItems', () => {
      beforeEach((done) => { //Before each test we empty the database
          GovItem.remove({}, (err) => {
             GovItem.create(sampleGovItem).then(()=>{
               GovItem.findOne().then((item)=>{
                 govItemSeed = item;
                 done();
               });
             }).catch((err) => {throw new Error(err)})
          });
      });

        beforeEach((done) => { //Before each test we empty the database
            User.remove({}, (err) => {
               User.create(sampleUser).then(()=>{
                 User.findOne().then((user)=>{
                   userSeed = user;
                   done();
                 });
               }).catch((err) => {throw new Error(err)});
            });
        });

  /*
    * Test the /GET route
    */
    // describe('/GET GovItems', () => {
    //     it('it should GET all the govItems', (done) => {
    //       chai.request(server)
    //           .get('/govITems')
    //           .end((err, res) => {
    //               res.should.have.status(200);
    //               res.body.should.be.a('array');
    //               res.body.length.should.be.eql(0);
    //             done();
    //           });
    //     });
    // });


// describe('create from sampleItem template', () => {
//  it('it should create without error', (done) => {
//    // 1. create sample user
//    let result = false;
//    User.create(sampleUser).then(()=>{
//      result = true;
//      result.should.not.be.false;
//      done();
//    }).catch((err)=>{
//      result.should.not.be.false;
//      done();
//      throw new Error(err);
//    });
//  });
// });

describe('/POST existing user should not return 404', () => {
 it('it should not return status 404', (done) => {

  let userPayload = userSeed;
  userPayload["govItem"] = govItemSeed;
   chai.request(server)
       .post('/api/users/update/' + userPayload._id)
       .send(userPayload)
       .end((err, res) => {
        // res.body.should.have.property.
          //  res.body.should.be.a('object');
          //  res.body.should.have.property('errors');
          //  res.body.errors.should.have.property('pages');
          //  res.body.errors.pages.should.have.property('kind').eql('required');
      //    res.body.notifications.should.have.length.above(0);
          setTimeout(()=>{
            res.should.not.have.status(404);
            done();
          }, 5000);

       });
 });
});
//
//     describe('/POST differing govItem', () => {
//      it('it should attach a notification to the user', (done) => {
//        // 1. create sample user
//        User.create(sampleUser);
//        // 2. create sample old govItem
//        GovItem.create(sampleGovItem);
//
//       let userPayload = sampleUser;
//       userPayload["govItem"] = sampleGovItem;
//       userPayload["govItem"]["data"] = {
//         current_status_description: 'new description!',
//         current_status_date: '456'
//       };
//        chai.request(server)
//            .post('/api/update/' + userPayload._id)
//            .send(userPayload)
//            .end((err, res) => {
//               //  res.should.have.status(200);
//               //  res.body.should.be.a('object');
//               //  res.body.should.have.property('errors');
//               //  res.body.errors.should.have.property('pages');
//               //  res.body.errors.pages.should.have.property('kind').eql('required');
//               res.body.notifications.should.have.length.above(0);
//              done();
//            });
//      });
//  });
//
//
//  describe('/POST same govItem', () => {
//   it('it should NOT attach a notification to the user', (done) => {
//     // 1. create sample user
//     User.create(sampleUser);
//     // 2. create sample old govItem
//     GovItem.create(sampleGovItem);
//
//    let userPayload = sampleUser;
//    userPayload["govItem"] = sampleGovItem;
//   //  userPayload["govItem"]["data"] = {
//   //    current_status_description: 'new description!',
//   //    current_status_date: '456'
//   //  };
//     chai.request(server)
//         .post('/api/update/' + userPayload._id)
//         .send(userPayload)
//         .end((err, res) => {
//            //  res.should.have.status(200);
//            //  res.body.should.be.a('object');
//            //  res.body.should.have.property('errors');
//            //  res.body.errors.should.have.property('pages');
//            //  res.body.errors.pages.should.have.property('kind').eql('required');
//            res.body.notifications.should.not.have.length.above(0);
//           done();
//         });
//   });
// });
});
