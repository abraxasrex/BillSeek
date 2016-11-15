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

router.get('/', (req, res, next) => {
  res.json(tags);
  console.log('got tags');
});

router.post('/', (req, res, next) => {
  let tags = [
    {name: 'women'},
    {name: 'finance'},
    {name: 'climates'}
  ];

  let newTag = req.body;

  console.log('newTag: ', newTag);
  tags.push(newTag);
  res.json({data: tags});
});

export default router;
