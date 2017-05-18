var express = require('express');
var router = express.Router();
var GroupManager = require('../model/GroupManager')
/* GET users listing. */
router.get('/list', function (req, res, next) {
    GroupManager.list(function (err, rows) {
        if (err == null) {
            res.json({ code: 1, info: 'success', data: rows })
        } else {
            res.json({ code: -1, info: 'fail' })
        }
    })
});

router.post('/add', function (req, res, next) {
    console.log(req.body);
    GroupManager.add(req.body.name, req.body.table_name, function (err) {
        if (err == null) {
            return res.redirect('../index.html');
        } else {
            return res.redirect('../index.html');
        }
    })
});

router.post('/delete', function (req, res, next) {
     GroupManager.delete(req.body.name, function (err) {
        if (err == null) {
            return res.redirect('../index.html');
        } else {
            return res.redirect('../index.html');
        }
    })
});

router.post('/updata', function (req, res, next) {
     GroupManager.update(req.body.name,req.body.new_name, function (err) {
        if (err == null) {
            return res.redirect('../index.html');
        } else {
            return res.redirect('../index.html');
        }
    })
});

module.exports = router;
