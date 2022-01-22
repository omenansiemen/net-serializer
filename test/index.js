const NetSerializer = require('..')
const { textHandlers } = require('./utils')

NetSerializer.setTextHandler(textHandlers.simple)

console.time('full test time')

require('./case1')
require('./case2')
require('./case3')
require('./case4')

console.timeEnd('full test time')