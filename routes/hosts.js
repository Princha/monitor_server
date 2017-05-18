var express = require('express');
var router = express.Router();
var HostManager = require('../model/HostManager')
/* GET users listing. */
router.post('/', function (req, res, next) {
    var ip = req.headers['x-real-ip'] ? req.headers['x-real-ip'] : req.ip.replace(/::ffff:/, '');
    console.log(ip)
    // console.log(req.body)
    req.body.onLine = true
    req.body.ip = ip
    req.body.updataTime = Date.now();
    HostManager.updataState(ip, req.body)
    res.send('respond with a resource');
});

router.post('/on', function (req, res, next) {
    var ip = req.headers['x-real-ip'] ? req.headers['x-real-ip'] : req.ip.replace(/::ffff:/, '');
    console.log('on')
    // console.log(req.body)
    // HostManager.updataState(ip, req.body)
    res.send('respond with a resource');
});

module.exports = router;
