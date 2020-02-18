const router = require('express').Router();
const verfiy = require('./verifyToken');

router.get('/', verfiy, (req, res) => {
  res.send(req.user);
  //   res.json({
  //     posts: {
  //       title: 'first post',
  //       description: 'random data'
  //     }
  //   });
});

module.exports = router;
