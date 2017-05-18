var db = require('../db')
var fs = require('fs');
var path = require('path')
var Fiber = require('fibers');
var HashMap = require('hashmap');
//保存host的信息
var HostMap = new HashMap();
var serverss;
exports.listHost = function (group_name,callback) {
    db.get(group_name,function (err, rows) {
        if (err == null) {
            callback(err, rows)
        } else {
            callback(err, null)
        }
    })
}

exports.startMonitor = function () {
    monitor()
}

exports.updataState = function (ip, state) {
    HostMap.set(ip, state)
}

exports.getHostState = function (servers) {
    // console.log(serverIps)
    var array = new Array()
    serverss = servers
    for (var index = 0; index < servers.length; index++) {
        var element = servers[index];
        // console.log(HostMap.get(element.ip))
        var item = HostMap.get(element.ip)
        if (item) {
            item.name = element.name
            array.push(item)
        }else{
            item = {}
            item.ip = element.ip
            item.name = element.name
            item.onLine = false
            array.push(item)
        }
    }
    return array
}

exports.addHost = function (group_name,serverName, serverIp, callback) {
    db.insert(group_name,serverName, serverIp, function (err) {
        callback(err)
    })
}

exports.deleteHost = function (group_name,serverIp, callback) {
    db.delete(group_name,serverIp, callback)
}

exports.updataHost = function (info, callback) {
    db.updata(info, callback)
}
// http://192.168.1.111/app/ibeacon/api.lua?api=/get_device_info
function monitor() {
    Fiber(function () {
        setInterval(function () {
            var current_time = Date.now();
            var time = 0;
            // console.log('calculor... ')
            HostMap.forEach(function (value, key) {
                // console.log(value)
                time = current_time - value.updataTime
                // console.log('time : ' + time)
                if (time > 10000) {
                    value.onLine = false
                }
            })
        }, 5000)
    }).run();
}