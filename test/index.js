import TypedFlattener from './netFlattener'
import * as testData from './testData'
import lz from "lz-string";

const stringHandler = {
  encode: function (input) {
    return lz.compressToUint8Array(input)
  },
  decode: function (input) {
    const typedArray = new Uint8Array(input)
    return lz.decompressFromUint8Array(typedArray)
  }
}

TypedFlattener.setTextHandler(stringHandler)

const aBuf = TypedFlattener.pack(testData.data, testData.dataTpl)
console.log(aBuf)

const obj = TypedFlattener.unpack(aBuf, testData.dataTpl)
console.log(obj)