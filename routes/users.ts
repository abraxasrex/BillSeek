import * as express from 'express';
import User from '../models/Users';

let router = express.Router();

router.post('/register', (req, res) => {
  User.findOne({username:req.body.username}).then((user)=>{
    if(!user){
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
     if(!user){
       res.status(404);
     } else {
       res.json(user);
     }
   }).catch(() => {
     res.sendStatus(404).json('no user');
   });
});

router.post('/update/:id', (req, res) => {
   User.findOne({_id:req.body._id}).then((user) => {
     user.username = req.body.username;
     user.password = req.body.password;
     user.starredItems = req.body.starredItems;
     User.update({_id:user._id}, user).then((updatedUser) => {
       console.log('my stars: ', user.starredItems);
       res.json(user);
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
