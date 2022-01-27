const NetSerializer = require('../..')
const data = require('./data')
const { template } = require('./template')
const utils = require('../utils')

utils.testBufferSize(data.original, template, 47)
const arrayBuffer = NetSerializer.pack(data.original, template)
const deserializedData = NetSerializer.unpack(arrayBuffer, template)
utils.compareObjects(data.expectedResult, deserializedData, 'Data 2 is corrupted!')