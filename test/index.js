const NetSerializer = require('../index')
const testData = require('./testData')
// const testData = {data: {val: true}, template: {val: {type: 'boolean'}}}
// const lz = require("lz-string")
const TextEncoder = require('text-encoding').TextEncoder
const TextDecoder = require('text-encoding').TextDecoder
// const util = require('util')

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

console.time('full test time')

/* testi 1 */
// console.log('Test 1, creating buffer')
// console.log(util.inspect(testData.data, false, null, true))

const aBuf = NetSerializer.pack(testData.data, testData.template, {
	onErrorCallback: error => console.error(error)
})
console.log('Data size in bytes', aBuf.byteLength)
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
let aBuf2 = NetSerializer.pack(testData.data, testData.template, {
	/* sharedBuffer, returnCopy: true */
})
console.time('perf test time')
for (let i = 0; i < 10; i++) {
	aBuf2 = NetSerializer.pack(testData.data, testData.template, {
		/* sharedBuffer, returnCopy: true */
	})
}
console.timeEnd('perf test time')

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
testData.template[1].unpackCallback = (item) => {
	obj3.push(item)
}
const result3 = NetSerializer.unpack(aBuf2, testData.template)
if (JSON.stringify(testData.expectedResult) !== JSON.stringify(obj3)) {
	console.error('Data 3 is corrupted!')
	process.exit(1)
}
if (result3.length > 0) {
	console.error('Data 3 result should be empty array because it is handled by unpack callback function')
}

console.timeEnd('full test time')
