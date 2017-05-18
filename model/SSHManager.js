var node_ssh = require('node-ssh')
var HashMap = require('hashmap');
var node_path = require('path')
var sshClientsMap = new HashMap();

exports.connect = function (ip) {
    var ssh = new node_ssh()
    ssh.onLine = false
    sshClientsMap.set(ip, ssh)
    ssh.connect({
        host: ip,
        username: 'ubuntu',
        privateKey: '/home/sae/.ssh/id_rsa'
    }).then(function () {
        console.log('connect it : ' + ip)
        ssh.onLine = true
        ssh.execCommand('pwd', {}).then(function (result) {
            // console.log('STDOUT: ' + result.stdout)
            // console.log('STDERR: ' + result.stderr)
            console.log(result.stdout)
            if (result.stdout.substring(result.stdout.length - 1, result.stdout.length) != '/') {
                ssh.homePath = result.stdout + '/'
                ssh.currentPath = result.stdout + '/'
            } else {
                ssh.homePath = result.stdout
                ssh.currentPath = result.stdout
            }
        })

    })
}

exports.getState = function (ip) {
    var ssh = sshClientsMap.get(ip)
    if (ssh) {
        return ssh.onLine
    } else {
        return false
    }
}

exports.disconnect = function (ip) {
    var ssh = sshClientsMap.get(ip)
    if (ssh) {
        ssh.dispose()
        sshClientsMap.remove(ip)
    } else {

    }
}

exports.execCommand = function (ip, cmd, callback) {
    const strs = cmd.match(/[a-zA-Z0-9._\/\~]+/g)
    var ssh = sshClientsMap.get(ip)
    if (strs[0] == 'cd' && strs.length > 1) {
        execCd(strs[1], ssh)
        var result = {}
        result.code = 0
        result.stdout = 'cd ' + ssh.currentPath
        ssh.execCommand('pwd', { cwd: ssh.currentPath }).then(function (result) {
            ssh.currentPath = result.stdout
            callback(result)
        })
        // callback(result)
    } else {
        if (ssh) {
            ssh.execCommand(cmd, { cwd: ssh.currentPath }).then(function (result) {
                // console.log('STDOUT: ' + result.stdout)
                // console.log('STDERR: ' + result.stderr)
                callback(result)
            })
        } else {
            var result = {}
            result.code = -1
            result.stderr = 'not connect'
            callback(result)
        }
    }

}


function execCd(path, ssh) {
    const start = path.substring(0, 1)
    if (ssh.currentPath.substring(ssh.currentPath.length - 1, ssh.currentPath.length) != '/') {
        ssh.currentPath = ssh.currentPath + '/'
    }
    switch (start) {
        case '/':
            console.log('/')
            // '/ /node'
            ssh.currentPath = node_path.normalize(path)
            break
        case '~':
            console.log('~')
            if (path.length > 2) {
                // '~/xxx'
                const strs = path.substring(2, path.length)
                ssh.currentPath = ssh.homePath + node_path.normalize(strs)
            } else {
                // '~/  ~'
                ssh.currentPath = ssh.homePath
            }
            break;
        default:
            // 'node/ node '
            console.log('default')
            ssh.currentPath = node_path.normalize(ssh.currentPath + path)
            break
    }
    if (ssh.currentPath.substring(ssh.currentPath.length - 1, ssh.currentPath.length) != '/') {
        ssh.currentPath = ssh.currentPath + '/'
    }
    console.log(ssh.currentPath)
}


exports.putFile = function (ip, local, remote, callback) {
    var ssh = sshClientsMap.get(ip)
    if (ssh) {
        ssh.putFile(local, remote).then(function () {
            var result = {}
            result.code = 0
            result.stdout = 'The File thing is done'
            callback(result)
            // console.log("The File thing is done")
        }, function (error) {
            var result = {}
            result.code = -1
            result.stderr = "Something's wrong"
            callback(result)
            // console.log("Something's wrong")
            // console.log(error)
        })
    } else {
        var result = {}
        result.code = -1
        result.stderr = "not connect"
        callback(result)
    }

}

exports.putDict = function (ip, local, remote, callback) {
    var ssh = sshClientsMap.get(ip)
    if (ssh) {
        // Putting entire directories 
        const failed = []
        const successful = []
        ssh.putDirectory(local, remote, {
            recursive: true,
            validate: function (itemPath) {
                const baseName = node_path.basename(itemPath)
                return baseName.substr(0, 1) !== '.' && // do not allow dot files 
                    baseName !== 'node_modules' // do not allow node_modules 
            },
            tick: function (localPath, remotePath, error) {
                if (error) {
                    failed.push(localPath)
                } else {
                    successful.push(localPath)
                }
            }
        }).then(function (status) {
            if (status) {
                var result = {}
                result.code = 0
                result.stdout = 'The Dict is done'
                callback(result)
            } else {
                var result = {}
                result.code = -1
                result.stderr = "Something's wrong"
                callback(result)
            }
            // console.log('the directory transfer was', status ? 'successful' : 'unsuccessful')
            // console.log('failed transfers', failed.join(', '))
            // console.log('successful transfers', successful.join(', '))
        })
    } else {
        var result = {}
        result.code = -1
        result.stderr = "not connect"
        callback(result)
    }

}