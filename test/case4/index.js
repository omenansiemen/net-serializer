const NetSerializer = require('../..')
const data = require('./data')
const { template } = require('./template')
const utils = require('../utils')

utils.testBufferSize(data.original, template, 21)

const arrayBuffer = NetSerializer.pack(
	data.original,
	template,
	{ onErrorCallback: (erro, stack) => console.log('stack', stack) },
)
const deserializedData = NetSerializer.unpack(arrayBuffer, template)
utils.compareObjects(data.expectedResult, deserializedData, 'Data 4 is corrupted!')