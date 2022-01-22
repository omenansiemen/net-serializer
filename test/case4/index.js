const NetSerializer = require('../..')
const data = require('./data')
const template = require('./template')
const { compareObjects } = require('../utils')

const arrayBuffer = NetSerializer.pack(
	data.original,
	template.data,
	{ onErrorCallback: (erro, stack) => console.log('stack', stack) },
)
const deserializedData = NetSerializer.unpack(arrayBuffer, template.data)
compareObjects(data.expectedResult, deserializedData, 'Data 4 is corrupted!')