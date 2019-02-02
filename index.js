"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isUndefined = (val) => typeof val === 'undefined';
const isBoolean = (val) => typeof val === 'boolean';
const isObject = (val) => typeof val === 'object';
const isArray = (val) => typeof val === 'object' && Array.isArray(val);
const isNumber = (val) => (typeof val === 'number' && isFinite(val)) || (val !== '' && isFinite(Number(val)));
const isMetaValue = (object) => typeof object.type === 'string';
function flatten(data, template, refObject = { sizeInBytes: 0, flatArray: [] }) {
    if (isArray(data) && isArray(template)) {
        // Storing information how many elements are
        const arrayLength = { _value: data.length, type: 'uint32' };
        refObject.flatArray.push(arrayLength);
        refObject.sizeInBytes += getByteLength(arrayLength);
        data.forEach((element) => {
            if (isObject(element)) {
                flatten(element, template[0], refObject);
            }
            else {
                // Add support for numeric arrays
                console.warn('Element of the array must be an object');
            }
        });
    }
    else {
        Object.keys(template).forEach(key => {
            const value = data[key];
            const templateValue = template[key];
            if (isObject(value)) {
                flatten(value, templateValue, refObject);
            }
            else if (typeof value === 'string' && isMetaValue(templateValue)) {
                const tmpValue = encodeText(value);
                const dataCopy = Object.assign({ _value: tmpValue }, templateValue);
                // Storing length of bytes in string
                if (templateValue.stringMaxLen) {
                }
                const type = templateValue.stringMaxLen ? templateValue.stringMaxLen : 'uint32';
                const stringLength = { _value: tmpValue.byteLength, type };
                refObject.flatArray.push(stringLength);
                refObject.sizeInBytes += getByteLength(stringLength);
                // Storing value as Uint8Array of bytes
                refObject.flatArray.push(dataCopy);
                refObject.sizeInBytes += tmpValue.byteLength;
            }
            else if (isNumber(value) && isMetaValue(templateValue)) {
                const dataCopy = Object.assign({ _value: value }, templateValue);
                refObject.flatArray.push(dataCopy);
                refObject.sizeInBytes += getByteLength(templateValue);
            }
            else {
                if (isUndefined(value)) {
                    console.warn('Template property', key, 'is not found from data', data);
                }
                console.error('This error must be fixed! Otherwise unflattening won\'t work.');
            }
        });
    }
    return refObject;
}
const addToBuffer = (params) => {
    const { metaValue, buffer, byteOffset } = params;
    const byteLength = getByteLength(metaValue);
    const view = new DataView(buffer, byteOffset, byteLength);
    let value = metaValue._value;
    if (isNumber(metaValue.multiplier) && isNumber(metaValue._value)) {
        value = metaValue._value * metaValue.multiplier;
    }
    if (metaValue.type === 'uint8' && isNumber(value)) {
        if (metaValue.preventOverflow) {
            value = (value < 0 ? 0 : (value > 255 ? 255 : value));
        }
        else if (!metaValue.allowOverflow) {
            console.assert(value >= 0 && value <= 255, 'Uint8 overflow', metaValue);
        }
        view.setUint8(0, value);
    }
    else if (metaValue.type === 'int8' && isNumber(value)) {
        if (metaValue.preventOverflow) {
            value = (value < -128 ? -128 : (value > 127 ? 127 : value));
        }
        else if (!metaValue.allowOverflow) {
            console.assert(value >= -128 && value <= 127, 'Int8 overflow', metaValue);
        }
        view.setInt8(0, value);
    }
    else if (metaValue.type === 'uint16' && isNumber(value)) {
        if (metaValue.preventOverflow) {
            value = (value < 0 ? 0 : (value > 65535 ? 65535 : value));
        }
        else if (!metaValue.allowOverflow) {
            console.assert(value >= 0 && value <= 65535, 'Uint16 overflow', metaValue);
        }
        view.setUint16(0, value < 0 ? 0 : value > 65535 ? 65535 : value);
    }
    else if (metaValue.type === 'int16' && isNumber(value)) {
        if (metaValue.preventOverflow) {
            value = (value < -32768 ? -32768 : (value > 32767 ? 32767 : value));
        }
        else if (!metaValue.allowOverflow) {
            console.assert(value >= -32768 && value <= 32767, 'Int16 overflow', metaValue);
        }
        view.setInt16(0, value);
    }
    else if (metaValue.type === 'uint32' && isNumber(value)) {
        if (metaValue.preventOverflow) {
            value = (value < 0 ? 0 : (value > 4294967295 ? 4294967295 : value));
        }
        else if (!metaValue.allowOverflow) {
            console.assert(value >= 0 && value <= 4294967295, 'Uint32 overflow', metaValue);
        }
        view.setUint32(0, value < 0 ? 0 : value > 4294967295 ? 4294967295 : value);
    }
    else if (metaValue.type === 'int32' && isNumber(value)) {
        if (metaValue.preventOverflow) {
            value = (value < -2147483648 ? -2147483648 : (value > 2147483647 ? 2147483647 : value));
        }
        else if (!metaValue.allowOverflow) {
            console.assert(value >= -2147483648 && value <= 2147483647, 'Int32 overflow', metaValue);
        }
        view.setInt32(0, value);
    }
    else if (metaValue.type === 'float32' && isNumber(value)) {
        view.setFloat32(0, value);
    }
    else if (metaValue.type === 'boolean' && isBoolean(value)) {
        view.setInt8(0, value === false ? 0 : 1);
    }
    else if (metaValue.type === 'string' && metaValue._value instanceof Uint8Array) {
        metaValue._value.forEach((value, slot) => view.setUint8(slot, value));
    }
    else {
        console.error('Unknown metaValue.type', metaValue.type, value);
    }
    return byteLength;
};
function getByteLength(value) {
    let byteLength;
    if (value.type === 'int32' || value.type === 'uint32' || value.type === 'float32') {
        byteLength = 4;
    }
    else if (value.type === 'int16' || value.type === 'uint16') {
        byteLength = 2;
    }
    else if (value.type === 'int8' || value.type === 'uint8' || value.type === 'boolean') {
        byteLength = 1;
    }
    else if (value.type === 'string') {
        if (value._value instanceof Uint8Array) {
            // Flattening
            byteLength = value._value.byteLength;
        }
        else {
            // Unflattening
            if (value.stringMaxLen === 'uint8') {
                byteLength = 1;
            }
            else if (value.stringMaxLen === 'uint16') {
                byteLength = 2;
            }
            else {
                byteLength = 4; // Slot for length of the text as bytes
            }
        }
    }
    else {
        throw Error(`Unknown type: ${value.type}`);
    }
    return byteLength;
}
function unflatten(buffer, template, options) {
    let result;
    if (isArray(template)) {
        result = [];
        const { value: length, byteOffset: newOffset } = getValueFromBuffer(buffer, { type: 'uint32' }, options.byteOffset);
        options.byteOffset = newOffset;
        for (let i = 0; i < length; i++) {
            result.push(unflatten(buffer, template[0], options));
        }
    }
    else {
        result = {};
        Object.keys(template).forEach(key => {
            if (isMetaValue(template[key])) {
                const { value, byteOffset: newOffset } = getValueFromBuffer(buffer, template[key], options.byteOffset);
                options.byteOffset = newOffset;
                Object.assign(result, { [key]: value });
            }
            else {
                const obj = unflatten(buffer, template[key], options);
                Object.assign(result, { [key]: obj });
            }
        });
    }
    return result;
}
function getValueFromBuffer(buffer, metaValue, byteOffset) {
    let value;
    let byteLength = getByteLength(metaValue);
    console.assert(byteOffset + byteLength <= buffer.byteLength);
    var view = new DataView(buffer, byteOffset, byteLength);
    if (metaValue.type === 'uint8') {
        value = view.getUint8(0);
    }
    else if (metaValue.type === 'int8') {
        value = view.getInt8(0);
    }
    else if (metaValue.type === 'uint16') {
        value = view.getUint16(0);
    }
    else if (metaValue.type === 'int16') {
        value = view.getInt16(0);
    }
    else if (metaValue.type === 'uint32') {
        value = view.getUint32(0);
    }
    else if (metaValue.type === 'int32') {
        value = view.getInt32(0);
    }
    else if (metaValue.type === 'float32') {
        value = view.getFloat32(0);
    }
    else if (metaValue.type === 'boolean') {
        value = view.getInt8(0) === 0 ? false : true;
    }
    else if (metaValue.type === 'string') {
        let strBufLen;
        let strBufStart;
        if (metaValue.stringMaxLen === 'uint8') {
            strBufLen = view.getUint8(0);
            byteLength += strBufLen;
            strBufStart = byteOffset + 1;
        }
        else if (metaValue.stringMaxLen === 'uint16') {
            strBufLen = view.getUint16(0);
            byteLength += strBufLen;
            strBufStart = byteOffset + 2;
        }
        else {
            strBufLen = view.getUint32(0);
            byteLength += strBufLen;
            strBufStart = byteOffset + 4;
        }
        const strBufEnd = strBufStart + strBufLen;
        value = decodeText(buffer.slice(strBufStart, strBufEnd));
    }
    else {
        throw Error(`Unknown metaValue.type ${metaValue}`);
    }
    if (isNumber(metaValue.multiplier) && isNumber(value)) {
        value = value / metaValue.multiplier;
    }
    return { value, byteOffset: byteOffset + byteLength };
}
exports.pack = (objects, template, extra = {}) => {
    const { sharedBuffer, startIndex = 0, returnCopy = false, } = extra;
    let { sizeInBytes, flatArray } = flatten(objects, template);
    let byteOffset = startIndex;
    let buffer;
    if (typeof sharedBuffer !== 'undefined') {
        buffer = sharedBuffer;
    }
    else {
        buffer = new ArrayBuffer(sizeInBytes);
    }
    flatArray.forEach(metaValue => {
        byteOffset += addToBuffer({
            buffer,
            metaValue,
            byteOffset
        });
    });
    if (typeof sharedBuffer !== 'undefined' && returnCopy) {
        return buffer.slice(startIndex, byteOffset);
    }
    return buffer;
};
exports.unpack = (buffer, template) => {
    return unflatten(buffer, template, { byteOffset: 0 });
};
const MakeDecoderFn = (decoder) => (input) => decoder.decode(input);
let decodeText;
const setTextDecoder = (decoder) => {
    decodeText = MakeDecoderFn(decoder);
};
if (typeof TextDecoder === 'function') {
    setTextDecoder(new TextDecoder());
}
const MakeEncoderFn = (encoder) => (input) => encoder.encode(input);
let encodeText;
const setTextEncoder = (encoder) => {
    encodeText = MakeEncoderFn(encoder);
};
if (typeof TextEncoder === 'function') {
    setTextEncoder(new TextEncoder());
}
exports.setTextHandler = (handler) => {
    encodeText = MakeEncoderFn(handler);
    decodeText = MakeDecoderFn(handler);
};
const NetSerializer = {
    pack: exports.pack,
    unpack: exports.unpack,
    setTextHandler: exports.setTextHandler
};
exports.default = NetSerializer;
