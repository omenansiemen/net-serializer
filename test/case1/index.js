const NetSerializer = require('../..')
const data = require('./data')
const template = require('./template')
const utils = require('../utils')

const bufferSizeInBytes = 1875
const sharedBuffer = new ArrayBuffer(bufferSizeInBytes)
// Calculates buffer size regardles of givin buffer as param
testProblem({ sharedBuffer })
// Does not calculate buffer size because bufferSizeInBytes param is given
testProblem({ sharedBuffer, bufferSizeInBytes })
testProblem({ sharedBuffer, bufferSizeInBytes, returnCopy: true })

function testProblem(params) {
	const aBuf = NetSerializer.pack(data.original, template.data, params)
	const problemResult = NetSerializer.unpack(aBuf, template.data)
	utils.compareObjects(data.expectedResult, problemResult, 'Data 1 is corrupted!')
	if (params.returnCopy) {
		if (aBuf === params.sharedBuffer) {
			console.error('Data 1 is corrupted. Pack returned shared buffer!')
			process.exit(1)
		}
	} else if (aBuf !== params.sharedBuffer) {
		console.error('Data 1 is corrupted. Pack did not returned shared buffer!')
		process.exit(1)
	}
}