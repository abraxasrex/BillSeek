import * as express from 'express';
import GovItem from '../models/GovItems';
import User from '../models/Users';
//type, apiLocation, data
let router = express.Router();

router.get('/:id/:type', (req, res, next) =>{
  GovItem.findOne({govId: req.params.id, type: req.params.type}).then((govItem)=>{
   console.log(req.params);
    res.send(govItem);
    //TODO error handling
  }).catch((err)=>{
    console.log(err);
    res.send(err);
  });
});

router.post('/:id', (req, res, next) =>{
  GovItem.findOne({govId: req.params.id, type: req.body.type}).then((govItem)=>{
    //check for dupes
    if(govItem == null){
      GovItem.create(req.body).then((item)=>{
        res.json(item); //ok!
      })
    } else {
      res.send(500); //dupe!
    }
  }).catch((err)=>{
    res.sendStatus(504);
  });
});
// router.get('/:id', (req, res, next)=>{
//   if(req.params.id){
//
//   }
// });

// trash collector for govItems

function cleanGovItems(){
  GovItem.find().then((items)=>{
    items.forEach((item)=>{
      User.findOne((user)=>{
        if(user == null){
          GovItem.remove({_id: item._id});
        }
      });
    });
    setTimeout(cleanGovItems, 100000000);
    console.log('cleaned.');
  });
}

//cleanGovItems();

export default router;
