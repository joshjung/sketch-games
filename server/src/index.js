require('babel-core/register')

for (var k in process.env) {
  console.log(`${k}: ${process.env[k]}`);
}

exports = module.exports = require('./app')

