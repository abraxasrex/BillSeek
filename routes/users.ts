import * as express from 'express';
import User from '../models/Users';
import GovItem from '../models/GovItems';
let router = express.Router();
function createNotification(oldGovItem, newGovItem){
  // console.log(oldGovItem["data"].current_status_description);
  // console.log(newGovItem["data"].current_status_description);
  let msg = null;
  if(oldGovItem["type"] === 'bill'){
        if(oldGovItem["data"].current_status_date !== newGovItem["data"].current_status_date){
          msg = newGovItem["data"].current_status_description;
        }
    }
 return msg;
}

function updateUser(user, _res){
  console.log('updating user...');
  //console.log(user);
//  console.log(res);
  User.update({_id:user._id}, user).then(() => {
    _res.json(user);
  }).catch((err) => {
    _res.status(400).json(err);
  });
}

function updateGovItems(govItem, user){
    GovItem.findOne({govId: govItem.govId}).then((item)=>{
      if(item == null){
        GovItem.create(govItem);
      }
    }).catch((err)=>{
      console.log('update error');
      console.log(err);
    });
}

router.post('/register', (req, res) => {
  User.findOne({username:req.body.username}).then((user)=>{
    if(user === null){
      let user = new User();
      user.username = req.body.username;
      user.password = req.body.password;
      user.starredItems = req.body.starredItems;
      user.notifications = req.body.notifications;
      User.create(user).then((newUser) => {
        res.json(newUser);
      }).catch((err) => {
        console.log("creation error");
        console.log(err);
        res.status(500).json(err);
      });
    } else {
      res.status(400).send('dupe');
    }
  }).catch((err)=>{
    res.status(500).send(err);
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

function checkforNotification (newItem, user, res){
   GovItem.findOne({govId: newItem.govId}).then((item)=>{
     //if theres a match, check for notifications
     if(item != null){
       let notification = createNotification(item, newItem);
       if(notification){
         user.notifications.push(notification);
         User.update({_id: user._id}, user).then(()=>{
           updateUser(user, res);
           console.log("notification!: notification added");
         });
       }
     } else{
        GovItem.create(newItem).then(()=>{
          updateUser(user, res);
        }).catch((err)=>{
          //wrong
        //  updateUser(user, res);
        console.log('could not create gov item');
          console.log(err);
        });
      }
      // updateUser(user, res);
   }).catch((err)=>{
     console.log(err);
   });
}

router.post('/update/:id', (req, res) => {
  let id = req.params.id;
  let govItem = req.body["govItem"];

   User.findOne({ _id: id }).then((_user) => {
     let user = _user;
     user.username = req.body.username;
     user.password = req.body.password;
     user.starredItems = req.body.starredItems;
     user.notifications = req.body.notifications || [];
     if(govItem){
       checkforNotification(govItem, user, res);
     } else {
        updateUser(user, res);
     }
   }).catch((err) => {
     res.sendStatus(404).json('no user');
   });
});

router.get('/notifications/:id', (req, res)=>{
  let id = req.params.id;
  User.findOne({ _id:  id}).then((_user) => {
    console.log('found');
    if(_user["notifications"].length){
      res.json(_user["notifications"]);
    } else {
      res.json([]);
    }
  }).catch((err) => {
    res.sendStatus(404).json('no user');
  });
});
export default router;
