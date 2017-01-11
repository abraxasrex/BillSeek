import * as express from 'express';
import User from '../models/Users';
import GovItem from '../models/GovItems';
let router = express.Router();

function createNotification(oldThing, newThing){
 return 'blah blah';
}

function updateGovItems(govItem, user){
    GovItem.findOne({govId: govItem.govId}).then((item)=>{
      if(item == null){
        GovItem.create(govItem);
      }
    }).catch((err)=>{
      console.log(err);
    });
}

router.post('/register', (req, res) => {
  User.findOne({username:req.body.username}).then((user)=>{
    if(!user){
      let user = new User();
      user.username = req.body.username;
      user.password = req.body.password;
      user.starredItems = req.body.starredItems;
      user.notifications = req.body.notifications;
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


function updateUser(user, res){
  User.update({_id:user._id}, user).then(() => {
    res.json(user);
  }).catch((err) => {
    res.status(400).json(err);
  });
}

router.post('/update/:id', (req, res) => {
   User.findOne({_id:req.body._id}).then((user) => {
    console.log('myyy stars: ', req.body.starredItems);
     user.username = req.body.username;
     user.password = req.body.password;
     user.starredItems = req.body.starredItems;
     user.notifications = req.body.notifications;
     if(req.body["govItem"]){
       let newItem = req.body["govItem"];
        updateGovItems(newItem, user);
        GovItem.findOne({govId: newItem.govId}).then((item)=>{
          if(newItem !== item){
            let notification = createNotification(item, newItem);
            user.notifications.push(notification);
          }
            updateUser(user, res);
            return;
        });
     }
      updateUser(user, res);
      return;
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
