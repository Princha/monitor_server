var express = require('express');
var router = express.Router();
var SSHManager = require('../model/SSHManager')
var request = require('superagent');

/* GET users listing. */
router.get('/connect', function (req, res, next) {
    SSHManager.connect(req.query.ip)
    setTimeout(function () {
        if (SSHManager.getState(req.query.ip)) {
            res.send('ssh connect success');
        } else {
            res.send('ssh connect fail');
        }
    }, 2000)
});
router.get('/disconnect', function (req, res, next) {
    res.send('ssh disconnect');
});
router.post('/cmd', function (req, respone, next) {
    console.log(JSON.stringify(req.body))
    const c = JSON.parse(req.body.cmd)
    request
        .post(c.url)
        .send(c)
        .set('Accept', 'application/json')
        .end(function (err, res) {
            // Calling the end function will send the request
            if (!err) {
                res.body.code = 1
                res.body.info = 'success'
                console.log(res.body)
                respone.send(res.body)
            } else {
                const body = {code:-1,info:'fail'}
                respone.send(body)
            }
        });
    // SSHManager.execCommand(req.query.ip, req.query.cmd, function (result) {
    //     res.send(result);
    // })
});


module.exports = router;
