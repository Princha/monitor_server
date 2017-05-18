var express = require('express');
var router = express.Router();
var beaconHost = require('../model/beaconHost')
var HostManager = require('../model/HostManager')
/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('index', { title: 'Express' });
  res.render('index.html')
});
module.exports = router;
