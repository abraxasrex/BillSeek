import * as express from 'express';
let router = express.Router();

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// tags api //
let tags = [
  {name: 'women'},
  {name: 'finance'},
  {name: 'climate'}
];

let foundTags = (t) => {
  return tags.filter((tag) => {
    return tag.name === t.name;
  });
}

router.get('/', (req, res, next) => {
    console.log('got tags');
    res.json(tags);
});

router.post('/', (req, res, next) => {
   let newTag = req.body;
   let found = foundTags(newTag);
   if(found.length < 1){
     tags.push(newTag);
   } else {
     tags.splice(tags.indexOf(found[0]), 1, newTag);
   }
   res.json({data: tags});
});

router.delete('/:name', (req, res, next) => {
  let found = foundTags({name: req.params.name});
  tags.splice(tags.indexOf(found[0]), 1);
  res.json({data:tags});
});

export default router;
