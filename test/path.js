var path = require('path')
const p = 'goo/~/node/app/./../test'
// const p = '../node/app/./../test'
console.log(path.normalize(p))