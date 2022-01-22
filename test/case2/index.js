const NetSerializer = require('../..')
const data = require('./data')
const template = require('./template')
const utils = require('../utils')

const arrayBuffer = NetSerializer.pack(data.original, template.data)
const deserializedData = NetSerializer.unpack(arrayBuffer, template.data)
utils.compareObjects(data.expectedResult, deserializedData, 'Data 2 is corrupted!')