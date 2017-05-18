// const cmd = '../node/'
// const cmd = '~/node'
// const cmd = './node'
var node_path = require('path')
var ssh = {}
ssh.currentPath = '/home/unbutn/'
ssh.homePath = '/home/ubuntu/'
const path = '/node/app'
const start = path.substring(0, 1)
execCd(path,ssh)
function execCd(path, ssh) {
    const start = path.substring(0, 1)
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
            ssh.currentPath =node_path.normalize(ssh.currentPath+path)
            break
    }
    if (ssh.currentPath.substring(ssh.currentPath.length - 1, ssh.currentPath.length) != '/') {
        ssh.currentPath = ssh.currentPath + '/'
    }
    console.log(ssh.currentPath)
}
