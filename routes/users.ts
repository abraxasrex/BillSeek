import * as express from 'express';
import User from '../models/Users';
import GovItem from '../models/GovItems';
let router = express.Router();

function createNotification(oldGovItem, newGovItem){
  let msg = null;
  if(oldGovItem["type"] === 'bill'){
        if(oldGovItem["data"].current_status_date !== newGovItem["data"].current_status_date){
          msg = newGovItem["data"].current_status_description;
        }
    }
 return msg;
}

function updateUser(user, _res){
  console.log("updating user");
  User.update({_id:user._id}, user).then((_user) => {
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
    }).catch((e)=>{ throw new Error(e); });
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
      }).catch((e) => { res.status(500).json(e); });
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
  console.log("checking notis");
   GovItem.findOne({govId: newItem.govId}).then((item)=>{
     console.log("found some existing govitem, item is null? ", item == null);
     if(item != null){
       let notification = createNotification(item, newItem);
       console.log(notification);
       if(notification){
         user.notifications.push(notification);
         console.log("about to update: ", user._id);
         User.update({_id: user._id}, user).then(()=>{
           console.log("some update");
           updateUser(user, res);
         }).catch((e)=>{ throw new Error (e); });
       } else {
         console.log("no notifications");
         updateUser(user, res);
       }
     } else{
        GovItem.create(newItem).then(()=>{
          updateUser(user, res);
        }).catch((e)=>{ throw new Error(e); });
      }
   }).catch((e)=>{ throw new Error(e); });
}

router.post('/update/:id', (req, res) => {
//  console.log(req["body"]);
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
    if(_user["notifications"].length){
      res.json(_user["notifications"]);
    } else {
      res.json([]);
    }
  }).catch((err) => {
    res.sendStatus(404).json('no user');
  });
});

router.get('/visitorView/:username', (req, res)=>{
  let username = req.params.username;
  User.findOne({username:  username}).then((_user) => {
    res.json(_user);
  }).catch((err) => {
    res.sendStatus(404).json('no user');
  });
});

export default router;
