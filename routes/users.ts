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

router.post('/', (req, res) => {
  let user = new User();
  user.username = req.body.username;
  user.password = req.body.password;
  user.starredItems = req.body.starredItems
  user.save().then((newAnimal) => {
    res.json(newAnimal);
  }).catch((err) => {
    res.status(400).json(err);
  });
});

router.post('/:id', (req, res) => {
  let userId = req.params.id;
  User.findById(userId).then((user) => {
    user.username = req.body.username;
    user.password = req.body.password;
    user.starredItems = req.body.starredItems
    user.save().then((updatedUser) => {
      res.json(updatedUser);
    }).catch((err) => {
      res.status(400).json(err);
    });
  }).catch(() => {
    res.sendStatus(404);
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
