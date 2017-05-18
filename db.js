var sqlite3 = require('sqlite3');
var db;
exports.start = function (callback) {
    console.log('db start')
    db = new sqlite3.Database('./server.db', function () {
        db.run("create table if not exists groups (name TEXT,table_name TEXT)", function (err) {
            if (!err) {
                db.run("create table all_host(name TEXT,ip TEXT)", function (err) {
                    if (!err) {
                        db.run("insert into groups values('all','all_host')", function (err) {
                            callback(err)
                        })
                    } else {
                        callback(err)
                    }
                });
            } else {
                callback(err)
            }

        });
    });
}
exports.addGroup = function (name, table_name, callback) {
    db.run("create table '" + table_name + "'(name TEXT,ip TEXT)", function (err) {
        if (!err) {
            db.run("insert into groups values('" + name + "','" + table_name + "')", function (err) {
                callback(err)
            })
        } else {
            callback(err)
        }
    });
}

exports.updataGroup = function (name, new_name, callback) {
    db.serialize(function () {
        db.run("UPDATE  groups SET name = '" + new_name + "' WHERE name='" + name + "'", function (err) {
            callback(err)
        });
    });
}
getGroupTableName = function (name, callback) {
    db.get("select * from groups where name='" + name + "'", function (err, row) {
        if (!err) {
            // console.log(err,row.table_name)
            if (row != null) {
                callback(err, row)
            } else {
                callback(null)
            }
        } else {
            callback(err)
        }
    })
}
exports.deleteGroup = function (name, callback) {
    db.get("select * from groups where name='" + name + "'", function (err, row) {
        if (!err) {
            // console.log(err,row.table_name)
            if (row != null) {
                db.run("drop table '" + row.table_name + "'", function (err) {
                    if (!err) {
                        db.run("delete from groups where name = '" + name + "'", function (err) {
                            callback(err)
                        })
                    } else {
                        callback(err)
                    }
                })
            } else {
                callback(null)
            }
        } else {
            callback(err)
        }
    })
}
exports.listGroups = function (callback) {
    db.all("select * from groups", function (err, row) {
        callback(err, row)
    })
}
exports.insert = function (group_name, serverName, serverIp, callback) {
    db.serialize(function () {
        getGroupTableName(group_name, function (err, row) {
            if (!err && row != null) {
                db.get("SELECT * FROM '" + row.table_name + "' WHERE ip='" + serverIp + "'", function (err, r) {
                    if (typeof r == "undefined") { //empty result set
                        db.run("insert into '" + row.table_name + "' values('" + serverName + "','" + serverIp + "')", function (err) {
                            callback(err)
                        })
                    } else {
                        // console.log(row.name + ' ' + row.ip);
                        callback(err)
                    }
                })
            } else {
                callback(err)
            }
        })
    });
}
exports.get = function (group_name, callback) {
    db.serialize(function () {
        getGroupTableName(group_name, function (err, row) {
            if (!err && row != null) {
                db.all("SELECT rowid AS id, name,ip FROM '" + row.table_name + "'", function (err, rows) {
                    // console.log(rows)
                    callback(err, rows)
                });
            } else {
                callback(err, null)
            }
        })
    });
}
exports.delete = function (group_name, serverIp, callback) {
    getGroupTableName(group_name, function (err, row) {
        if (!err && row != null) {
            db.serialize(function () {
                db.run("DELETE FROM '" + row.table_name + "' WHERE ip='" + serverIp + "'", function (err) {
                    callback(err)
                });
            });
        } else {
            callback(err, null)
        }
    })
}

exports.updata = function (info, callback) {
    getGroupTableName(info.group_name, function (err, row) {
        if (!err && row != null) {
            db.serialize(function () {
                db.run("UPDATE  '" + row.table_name + "' SET name = '" + info.name + "' WHERE ip='" + info.ip + "'", function (err) {
                    callback(err)
                });
            });
        } else {
            callback(err)
        }
    })
}

exports.close = function () {
    db.close();
}
