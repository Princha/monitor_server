var db = require('../db')
exports.list = function (callback) {
    db.listGroups(function (err, rows) {
        if (err == null) {
            callback(err, rows)
        } else {
            callback(err, null)
        }
    })
}

exports.add = function (name, table_name, callback) {
    db.addGroup(name, table_name, function (err) {
        callback(err)
    })
}
exports.delete = function (group_name,callback) {
    db.deleteGroup(group_name,function (err) {
        callback(err)
    })
}

exports.update = function (name,new_name,callback) {
    db.updataGroup(name,new_name,function (err) {
        callback(err)
    })
}
