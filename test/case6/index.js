const NetSerializer = require('../..')
const data = require('./data')
const { template } = require('./template')
const utils = require('../utils')

utils.testBufferSize(data.original, template, 26)

NetSerializer.pack(data.original, template)
const aBuf = NetSerializer.pack(data.original, template)
const problemResult = NetSerializer.unpack(aBuf, template)
utils.compareObjects(data.expectedResult, problemResult, 'Data 6 is corrupted!')