var path, node_ssh, ssh, fs
 
fs = require('fs')
path = require('path')
node_ssh = require('node-ssh')
ssh = new node_ssh()
 
ssh.connect({
  host: '192.168.31.100',
  username: 'ubuntu',
  privateKey: '/home/sae/.ssh/id_rsa'
}).then(function() {
  // Local, Remote 
  ssh.putFile('/var/www/monitor_server/test/test.js', '/home/ubuntu/test.js').then(function() {
    console.log("The File thing is done")
  }, function(error) {
    console.log("Something's wrong")
    console.log(error)
  })

 // Putting entire directories 
  const failed = []
  const successful = []
  ssh.putDirectory('/var/www/monitor_server/test/', '/home/ubuntu/test', {
    recursive: true,
    validate: function(itemPath) {
      const baseName = path.basename(itemPath)
      return baseName.substr(0, 1) !== '.' && // do not allow dot files 
             baseName !== 'node_modules' // do not allow node_modules 
    },
    tick: function(localPath, remotePath, error) {
      if (error) {
        failed.push(localPath)
      } else {
        successful.push(localPath)
      }
    }
  }).then(function(status) {
    console.log('the directory transfer was', status ? 'successful' : 'unsuccessful')
    console.log('failed transfers', failed.join(', '))
    console.log('successful transfers', successful.join(', '))
  })

  // Command 
  ssh.execCommand('cd /home/ubuntu', {  }).then(function(result) {
    console.log('STDOUT: ' + result.stdout)
    console.log('STDERR: ' + result.stderr)
  })
  ssh.execCommand('cat hsp.txt', {  }).then(function(result) {
    console.log('STDOUT: ' + result.stdout)
    console.log('STDERR: ' + result.stderr)
  })
  ssh.execCommand('ls /home/ubuntu/node', {  }).then(function(result) {
    console.log('STDOUT: ' + result.stdout)
    console.log('STDERR: ' + result.stderr)
  })
})