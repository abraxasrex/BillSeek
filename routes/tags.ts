import * as express from 'express';
let router = express.Router();


function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// tags api //
// let tags = user.tags

let foundTags = (_id) => {
  return tags.filter((tag) => {
    return tag._id === _id;
  });
}

router.get('/', (req, res, next) => {
    res.json(tags);
});

router.post('/', (req, res, next) => {
   let newTag = req.body;
   let found = foundTags(newTag._id);
   if(found.length < 1){
     tags.push(newTag);
   } else if(!newTag._id) {
     newTag._id = getRandomIntInclusive(1000, 2000);
     tags.push(newTag);
   } else {
     console.log(`replaced ${found[0]._id} with ${newTag._id}`);
     tags.splice(tags.indexOf(found[0]), 1, newTag);
   }
   res.json({data: tags});
});

router.delete('/:_id', (req, res, next) => {
  console.log('delete this: ', req.params._id);
  let found = foundTags(req.params._id);
  tags.splice(tags.indexOf(found[0]), 1);
  res.json({data:tags});
});

export default router;
