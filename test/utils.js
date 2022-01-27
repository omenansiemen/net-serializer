const { calculateBufferSize } = require('..')
const TextEncoder = require('text-encoding').TextEncoder
const TextDecoder = require('text-encoding').TextDecoder

exports.textHandlers = {
    advanced: {
        encode: function (input) {
            // return lz.compressToUint8Array(input)
            return new TextEncoder().encode(input)
        },
        decode: function (input) {
            const typedArray = new Uint8Array(input)
            // return lz.decompressFromUint8Array(typedArray)
            return new TextDecoder().decode(typedArray)
        }
    },
    simple: {
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
}

exports.compareObjects = (a, b, errorMessage) => {
    if (JSON.stringify(a) !== JSON.stringify(b)) {
        throw Error(errorMessage)
    }
}

exports.testBufferSize = (data, template, expected) => {
    const bufferSize = calculateBufferSize(data.original, template.data)
    if (bufferSize !== expected) {
        throw Error(`Incorrect buffer size, expected ${expected} but got ${bufferSize}`)
    }
}