const NetSerializer = require('../..')
const data = require('./data')
const { template } = require('./template')
const utils = require('../utils')

const bufferSizeInBytes = 1875
utils.testBufferSize(data.original, template, bufferSizeInBytes)
const sharedBuffer = new ArrayBuffer(bufferSizeInBytes)
// Calculates buffer size regardles of givin buffer as param
testProblem({ sharedBuffer })
// Does not calculate buffer size because bufferSizeInBytes param is given
testProblem({ sharedBuffer, bufferSizeInBytes })

function testProblem(params) {
	const aBuf = NetSerializer.pack(data.original, template, params)
	const problemResult = NetSerializer.unpack(aBuf, template)
	utils.compareObjects(data.expectedResult, problemResult, 'Data 1 is corrupted!')
	if (aBuf !== params.sharedBuffer) {
		console.error('Data 1 is corrupted. Pack did not returned shared buffer!')
		process.exit(1)
	}
}