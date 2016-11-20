import * as express from 'express';
import GovItem from '../models/GovItems';

let router = express.Router();

router.get('/', (req, res) => {
  GovItem.find().then((govItems)=> {
      res.json(govItems);
  }).catch((err) => {
      res.status(500);
      console.error(err);
  })
});

router.get('/:id', (req, res) => {
  GovItem.findById(req.params['id']).then((govItem) => {
    res.json(govItem);
  });
});

router.post('/', (req, res) => {
  let govItem = new GovItem();
  govItem.type = req.body.type;
  govItem.stars = req.body.stars;
  govItem.apiLocation = req.body.apiLocation
  govItem.save().then((newAnimal) => {
    res.json(newAnimal);
  }).catch((err) => {
    res.status(400).json(err);
  });
});

router.post('/:id', (req, res) => {
  let govItemId = req.params.id;
  GovItem.findById(govItemId).then((govItem) => {
    govItem.type = req.body.type;
    govItem.stars = req.body.stars;
    govItem.apiLocation = req.body.apiLocation
    govItem.save().then((updatedGovItem) => {
      res.json(updatedGovItem);
    }).catch((err) => {
      res.status(400).json(err);
    });
  }).catch(() => {
    res.sendStatus(404);
  });
});

router.delete('/:id', (req, res) => {
  let govItemId = req.params.id;
  GovItem.remove({_id:govItemId}).then(() => {
    res.sendStatus(200);
  }).catch((err) => {
    res.status(500);
    console.log(err);
  });
});

export default router;
