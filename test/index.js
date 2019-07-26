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

const stringHandlerSimple = {
	encode: function (input) {
		const buffer = new Uint8Array(input.length)
		for (let i = 0; i < input.length; i++) {
			buffer[i] = input.charCodeAt(i)
		}
		return buffer
	},
	decode: function (input) {
		const buffer = new Uint8Array(input)
		return String.fromCharCode(...buffer)
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
	console.error('Data 1 is corrupted!')
	process.exit(1)
}

/* testi 2 */
// console.log('Test 2, shared buffer')
// console.log(util.inspect(testData.data, false, null, true))

// const sharedBuffer = new ArrayBuffer(50)
const aBuf2 = NetSerializer.pack(testData.data, testData.template, {
	/* sharedBuffer, returnCopy: true */
})

// if (sharedBuffer.byteLength !== aBuf2.byteLength) {
// 	process.exit(1)
// }
// console.log(aBuf2)
// console.log(new TextEncoder().encode(JSON.stringify(testData.data)).byteLength)

// const obj2 = NetSerializer.unpack(sharedBuffer, testData.template)
const obj2 = NetSerializer.unpack(aBuf2, testData.template)
// console.log(util.inspect(obj2, false, null, true))

if (JSON.stringify(testData.expectedResult) !== JSON.stringify(obj2)) {
	console.error('Data 2 is corrupted!')
	process.exit(1)
}

/* testing array callback function works */
const obj3 = []
testData.template._netSerializer_.options.arrayCallback = (item) => {
	obj3.push(item)
}
NetSerializer.unpack(aBuf2, testData.template)
if (JSON.stringify(testData.expectedResult) !== JSON.stringify(obj3)) {
	console.error('Data 3 is corrupted!')
	process.exit(1)
}