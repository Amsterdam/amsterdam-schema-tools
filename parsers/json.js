const JSONStream = require('JSONStream')

module.exports = function (path) {
  return JSONStream.parse(path)
}
