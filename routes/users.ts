import * as express from 'express';
import User from '../models/Users';

let router = express.Router();

// username: string,
// password: string,
// starredItems: string []

router.get('/', (req, res) => {
  User.find().then((users)=> {
      res.json(users);
  }).catch((err) => {
      res.status(500);
      console.error(err);
  })
});

router.get('/:id', (req, res) => {
  User.findById(req.params['id']).then((user) => {
    res.json(user);
  });
});

router.post('/register', (req, res) => {
  User.findOne({username:req.body.username}).then((user)=>{
    if(!user){
      let user = new User();
      user.username = req.body.username;
      user.password = req.body.password;
      user.starredItems = req.body.starredItems
      User.create(user).then((newUser) => {
        console.log('new user');
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
   User.findOne({username:req.body.username}).then((_user) => {
     _user.username = req.body.username;
     _user.password = req.body.password;
     _user.starredItems = req.body.starredItems;
     User.update({_id:_user._id}, _user).then((updatedUser) => {
       console.log('new user');
       res.json(updatedUser);
     }).catch((err) => {
       res.status(400).json(err);
     });
   }).catch(() => {
     res.sendStatus(404).json('no user');
   });
});

router.delete('/:id', (req, res) => {
  let userId = req.params.id;
  User.remove({_id:userId}).then(() => {
    res.sendStatus(200);
  }).catch((err) => {
    res.status(500);
    console.log(err);
  });
});

export default router;
