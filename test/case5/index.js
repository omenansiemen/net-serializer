const NetSerializer = require('../..')
const data = require('./data')
const { template } = require('./template')
const utils = require('../utils')

utils.testBufferSize(data.original, template, 7)

const cacheBufferByTemplate = true

for (let i = 0; i < 10; i++) {
	NetSerializer.pack(data.original, template, { cacheBufferByTemplate })
}
const aBuf = NetSerializer.pack(data.original, template, { cacheBufferByTemplate })
const problemResult = NetSerializer.unpack(aBuf, template)
utils.compareObjects(data.expectedResult, problemResult, 'Data 5 is corrupted!')