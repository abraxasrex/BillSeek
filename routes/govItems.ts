import * as express from 'express';
import GovItem from '../models/GovItems';
import User from '../models/Users';
//type, apiLocation, data
let router = express.Router();

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

cleanGovItems();

export default router;
