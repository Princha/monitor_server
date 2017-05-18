// var sqlite3 = require('sqlite3');  
// var db = new sqlite3.Database('./1.db',function() {  
//   db.run("create table test(name varchar(15))",function(){  
//     db.run("insert into test values('hello,world')",function(){  
//       db.all("select * from test",function(err,res){  
//         if(!err)  
//           console.log(JSON.stringify(res));  
//         else  
//           console.log(err);  
//       });  
//     })  
//   });  
// });  

var db = require('../db')
db.start(function (err) {
  //  db.addGroup('huang', 'hsp', function (err) {
  //  })
  db.deleteGroup('huang',function(err){
    
  })
})
// db.start(function (err) {
//   if (!err) {
//     db.listGroups(function (err, res) {
//       if (!err) {
//         console.log('2')
//         console.log(res)
//       } else {
//         console.log('3')
//         console.log(err)
//       }
//     })
//   } else {
//     console.log('1')
//     console.log(err)
//   }
// })
// setTimeout(function () {
//   db.addGroup('huang', 'hsp', function (err) {
//     if (!err) {
//       db.listGroups(function (err, res) {
//         if (!err) {
//           console.log('2')
//           console.log(res)
//         } else {
//           console.log('3')
//           console.log(err)
//         }
//       })
//     } else {
//       console.log(err)
//     }
//   })
// }, 1000)

// setTimeout(function(){
// db.listGroups(function (err, res) {
//         if (!err) {

//           console.log(res)
//         } else {

//           console.log(err)
//         }
//       })
// },2000)
