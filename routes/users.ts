import * as express from 'express';
import User from '../models/Users';
import GovItem from '../models/GovItems';
let router = express.Router();
function createNotification(oldGovItem: Object, newGovItem){
  let msg = null;
  if(oldGovItem["type"] == 'bill'){
        if(oldGovItem["data"].current_status_date !== newGovItem["data"].current_status_date){
          msg = newGovItem["data"].current_status_description;
        }
    }
    //TODO some form of update when congress members change
 return msg;
}

function updateUser(user, _res){
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

router.post('/update/:id', (req, res) => {
   User.findOne({_id:req.params.id}).then((_user) => {
     let user = _user;
     user.username = req.body.username;
     user.password = req.body.password;
     user.starredItems = req.body.starredItems;
     user.notifications = req.body.notifications || [];
     if(req.body["govItem"]){
       let newItem = req.body["govItem"];
        GovItem.findOne({govId: newItem.govId}).then((item)=>{
          if(newItem !== item && item !== null){
            let notification = createNotification(item, newItem);
            if(notification){
              user.notifications.push(notification);
            }
          }
          if(item == null){
            console.log('This is what you are submitting: ', newItem);
             GovItem.create(newItem).then(()=>{
               console.log('made a new govitem!: ');
             }).catch((err)=>{
               console.log(err);
             });
           }
            updateUser(user, res);
          //  return;
        }).catch((err)=>{
          console.log(err);
        });
     } else {
        updateUser(user, res);
     }
    //  return;
   }).catch((err) => {
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
