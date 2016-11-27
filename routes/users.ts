import * as express from 'express';
import User from '../models/Users';

let router = express.Router();

// username: string,
// password: string,
// starredItems: string []

// router.get('/', (req, res) => {
//   User.find().then((users)=> {
//       res.json(users);
//   }).catch((err) => {
//       res.status(500);
//       console.error(err);
//   })
// });
//
// router.get('/:id', (req, res) => {
//   User.findById(req.params['id']).then((user) => {
//     res.json(user);
//   });
// });

router.post('/register', (req, res) => {
  User.findOne({username:req.body.username}).then((user)=>{
    if(!user){
      console.log('new user because no result from ', req.body);
      let user = new User();
      user.username = req.body.username;
      user.password = req.body.password;
      user.starredItems = req.body.starredItems
      User.create(user).then((newUser) => {
        res.json(newUser);
      }).catch((err) => {
        res.status(400).json(err);
      });
    } else {
      res.status(400).send('dupe');
    }
  });
});

router.post('/login', (req, res) => {
   User.findOne({username:req.body.username}).then((user) => {
     console.log('found user: ', user, ' matching : ', req.body);
     if(!user){
       res.status(404);
     } else {
       res.json(user);
     }
   }).catch(() => {
     res.sendStatus(404).json('no user');
   });
});

router.post('/editAccount', (req, res) => {
   User.findOne({username:req.body.username}).then((user) => {
     user.username = req.body.username;
     user.password = req.body.password;
     user.starredItems = req.body.starredItems;
     User.update({_id:user._id}, user).then((updatedUser) => {
       console.log('new user');
       res.json(updatedUser);
     }).catch((err) => {
       res.status(400).json(err);
     });
   }).catch(() => {
     res.sendStatus(404).json('no user');
   });
});
// router.delete('/:id', (req, res) => {
//   let userId = req.params.id;
//   User.remove({_id:userId}).then(() => {
//     res.sendStatus(200);
//   }).catch((err) => {
//     res.status(500);
//     console.log(err);
//   });
// });

export default router;
