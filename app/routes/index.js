const express = require('express')
var router = express.Router();

/* GET home routes. */
router.get('/', function (req, res, next) {
  res.send({ message: 'Welcome to the world of EXPRESS + MONGO' })
})
module.exports = router