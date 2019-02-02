const NetSerializer = require('../index')
const testData = require('./testData3')
// const testData = {data: {val: true}, template: {val: {type: 'boolean'}}}
const lz = require("lz-string")
const TextEncoder = require('text-encoding').TextEncoder
const TextDecoder = require('text-encoding').TextDecoder
const util = require('util')

const stringHandler = {
	encode: function (input) {
		// return lz.compressToUint8Array(input)
		return new TextEncoder().encode(input)
	},
	decode: function (input) {
		const typedArray = new Uint8Array(input)
		// return lz.decompressFromUint8Array(typedArray)
		return new TextDecoder().decode(typedArray)
	}
}

NetSerializer.setTextHandler(stringHandler)

/* testi 1 */
// console.log('Test 1, creating buffer')
// console.log(util.inspect(testData.data, false, null, true))

const aBuf = NetSerializer.pack(testData.data, testData.template)
// console.log(aBuf)
// console.log(new TextEncoder().encode(JSON.stringify(testData.data)).byteLength)

const obj = NetSerializer.unpack(aBuf, testData.template)
// console.log(util.inspect(obj, false, null, true))

if (JSON.stringify(testData.expectedResult) !== JSON.stringify(obj)) {
	process.exit(1)
}

/* testi 2 */
// console.log('Test 2, shared buffer')
// console.log(util.inspect(testData.data, false, null, true))

const sharedBuffer = new ArrayBuffer(50)
const aBuf2 = NetSerializer.pack(testData.data, testData.template, {
	sharedBuffer, returnCopy: true
})

// if (sharedBuffer.byteLength !== aBuf2.byteLength) {
// 	process.exit(1)
// }
// console.log(aBuf2)
// console.log(new TextEncoder().encode(JSON.stringify(testData.data)).byteLength)

const obj2 = NetSerializer.unpack(sharedBuffer, testData.template)
// console.log(util.inspect(obj2, false, null, true))

if (JSON.stringify(testData.expectedResult) !== JSON.stringify(obj2)) {
	process.exit(1)
}

/* testing copy is correct */

const obj3 = NetSerializer.unpack(aBuf2, testData.template)
if (JSON.stringify(testData.expectedResult) !== JSON.stringify(obj3)) {
	process.exit(1)
}