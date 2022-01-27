const NetSerializer = require('../..')
const data = require('./data')
const { template } = require('./template')
const utils = require('../utils')

utils.testBufferSize(data.original, template, 85681)

const aBuf = NetSerializer.pack(data.original, template, {
    onErrorCallback: error => console.error(error)
})
const result1 = NetSerializer.unpack(aBuf, template)
utils.compareObjects(data.expectedResult, result1, 'Data 3 is corrupted!')

/* testing array callback functionality */
const callbackResult = []
template[1].unpackCallback = (item) => {
    callbackResult.push(item)
}
const result2 = NetSerializer.unpack(aBuf, template)
utils.compareObjects(data.expectedResult, callbackResult, 'Data 3 is corrupted!')
if (result2.length > 0) {
    console.error('Data 3 result should be empty array because it is handled by unpack callback function')
    process.exit(1)
}