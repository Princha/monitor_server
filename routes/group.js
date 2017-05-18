var express = require('express');
var router = express.Router();
var beaconHost = require('../model/beaconHost')
var HostManager = require('../model/HostManager')




router.post('/getStates', function (req, res, next) {
  // console.log(req.body);
  var list = JSON.parse(req.body.servers)
  // console.log(list);
  var array = HostManager.getHostState(list)
  // console.log(array)
  res.json(array)
});

router.get('/listHosts', function (req, res, next) {
  HostManager.listHost(req.query.group_name,function(err,rows){
    if(err == null){
      res.json({code : 1 , info : 'success', data:rows})
    }else{
      res.json({code : -1 , info : 'fail'})
    }
  })
});

router.post('/add', function (req, res, next) {
  console.log(req.body);
  HostManager.addHost(req.body.group_name,req.body.name, req.body.ip, function (err) {
    if (err == null) {
      return res.redirect('../index.html');
    } else {
      return res.redirect('../index.html');
    }
  })
});
router.get('/delete',function(req, res, next){
  console.log(req.query.ip);
  HostManager.deleteHost(req.query.group_name,req.query.ip,function(err){
     if(err == null){
      res.json({code : 1 , info : 'success'})
    }else{
      res.json({code : -1 , info : 'fail'})
    }
  })
})

router.post('/updata',function(req, res, next){
  console.log(req.body);
  HostManager.updataHost(req.body,function(err){
    if (err == null) {
      return res.redirect('../index.html');
    } else {
      return res.redirect('../index.html');
    }
  })
  // HostManager.deleteHost(req.query.ip,function(err){
  //    if(err == null){
  //     res.json({code : 1 , info : 'success'})
  //   }else{
  //     res.json({code : -1 , info : 'fail'})
  //   }
  // })
})


module.exports = router;
