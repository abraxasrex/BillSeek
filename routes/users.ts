import * as express from 'express';
let router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/dogs', (req, res, next) => {
  res.json(req.body);
});

export default router;
