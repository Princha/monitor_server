var SSHManager = require('../model/SSHManager')
var ip = '192.168.31.100'
SSHManager.connect(ip)
setTimeout(function(){
    console.log(SSHManager.getState(ip))
},1000)
setTimeout(function(){
    SSHManager.execCommand(ip,'ls',function(result){
        console.log(result)
    })
},1500)

// setTimeout(function(){
//     SSHManager.execCommand('192.168.31.111','ls',function(result){
//         console.log(result)
//     })
// },1500)

setTimeout(function(){
   SSHManager.putDict(ip,'/var/www/monitor_server/test/','/home/ubuntu/test',function(result){
       console.log(result)
   })
},1500)

// setTimeout(function(){
//    SSHManager.putFile(ip,'/var/www/monitor_server/test/test.js','/home/ubuntu/test.js',function(result){
//         console.log(result)
//    })
// },1500)
// setTimeout(function(){
//     console.log(SSHManager.getState(ip))
// },2000)