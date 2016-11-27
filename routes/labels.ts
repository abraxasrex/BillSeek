import * as express from 'express';
import User from '../models/Users';
let router = express.Router();

//1. send password to get
router.get('/:pw', (req, res, next) => {
  console.log('password: ', req.params.pw);
  User.findOne({password: req.params.pw}).then((user)=>{
        res.json(user.labels);
  }).catch((err)=>{
    console.log(err);
  });
});
//2. send password to post

function updateLabels(pw, labels, res){
  User.update({password: pw}, {labels: labels}).then((user)=>{
    res.json(user.labels);
  }).catch((err)=>{
    console.log(err);
  });
}

router.post('/:pw', (req, res, next) => {
   updateLabels(req.params.pw, req.body, res);
});
router.delete('/:pw', (req, res, next) => {
 updateLabels(req.params.pw, req.body, res);
});

export default router;
