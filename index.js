"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isUndefined = (val) => typeof val === 'undefined';
const isBoolean = (val) => typeof val === 'boolean';
const isObject = (val) => typeof val === 'object';
const isArray = (val) => typeof val === 'object' && Array.isArray(val);
const isNumber = (val) => (typeof val === 'number' && isFinite(val)) || (val !== '' && isFinite(Number(val)));
var Types;
(function (Types) {
    Types["i8"] = "int8";
    Types["u8"] = "uint8";
    Types["i16"] = "int16";
    Types["u16"] = "uint16";
    Types["i32"] = "int32";
    Types["u32"] = "uint32";
    Types["f32"] = "float32";
    Types["f64"] = "float64";
    Types["bool"] = "boolean";
    Types["str8"] = "string8";
    Types["str16"] = "string16";
    Types["str32"] = "string";
})(Types = exports.Types || (exports.Types = {}));
const isMetaValue = (object) => {
    if (typeof object.type === 'string') {
        return true;
    }
    return false;
};
function flatten(data, template, refObject = { sizeInBytes: 0, flatArray: [] }) {
    if (isArray(data) && isArray(template)) {
        // Storing information how many elements are
        const arrayLength = { _value: data.length, type: Types.u32 };
        processMetaValue(refObject, arrayLength);
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
                let type = Types.u32;
                if (templateValue.type === Types.str8) {
                    type = Types.u8;
                }
                else if (templateValue.type === Types.str16) {
                    type = Types.u16;
                }
                const stringLength = { _value: tmpValue.byteLength, type };
                processMetaValue(refObject, stringLength);
                refObject.sizeInBytes += getByteLength(stringLength);
                // Storing value as Uint8Array of bytes
                processMetaValue(refObject, dataCopy);
                refObject.sizeInBytes += tmpValue.byteLength;
            }
            else if (isNumber(value) && isMetaValue(templateValue)) {
                const dataCopy = Object.assign({ _value: value }, templateValue);
                processMetaValue(refObject, dataCopy);
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
function processMetaValue(refObject, metaValue) {
    if (refObject.buffer) {
        addToBuffer({
            buffer: refObject.buffer,
            metaValue,
            byteOffset: refObject.sizeInBytes
        });
    }
    else {
        refObject.flatArray.push(metaValue);
    }
}
const addToBuffer = (params) => {
    const { metaValue, buffer, byteOffset } = params;
    const byteLength = getByteLength(metaValue);
    const view = new DataView(buffer, byteOffset, byteLength);
    let value = metaValue._value;
    if (isNumber(metaValue.multiplier) && isNumber(metaValue._value)) {
        value = metaValue._value * metaValue.multiplier;
    }
    if (metaValue.type === Types.u8 && isNumber(value)) {
        if (metaValue.preventOverflow) {
            value = (value < 0 ? 0 : (value > 255 ? 255 : value));
        }
        else if (!metaValue.allowOverflow) {
            console.assert(value >= 0 && value <= 255, 'Uint8 overflow', metaValue);
        }
        view.setUint8(0, value);
    }
    else if (metaValue.type === Types.i8 && isNumber(value)) {
        if (metaValue.preventOverflow) {
            value = (value < -128 ? -128 : (value > 127 ? 127 : value));
        }
        else if (!metaValue.allowOverflow) {
            console.assert(value >= -128 && value <= 127, 'Int8 overflow', metaValue);
        }
        view.setInt8(0, value);
    }
    else if (metaValue.type === Types.u16 && isNumber(value)) {
        if (metaValue.preventOverflow) {
            value = (value < 0 ? 0 : (value > 65535 ? 65535 : value));
        }
        else if (!metaValue.allowOverflow) {
            console.assert(value >= 0 && value <= 65535, 'Uint16 overflow', metaValue);
        }
        view.setUint16(0, value < 0 ? 0 : value > 65535 ? 65535 : value);
    }
    else if (metaValue.type === Types.i16 && isNumber(value)) {
        if (metaValue.preventOverflow) {
            value = (value < -32768 ? -32768 : (value > 32767 ? 32767 : value));
        }
        else if (!metaValue.allowOverflow) {
            console.assert(value >= -32768 && value <= 32767, 'Int16 overflow', metaValue);
        }
        view.setInt16(0, value);
    }
    else if (metaValue.type === Types.u32 && isNumber(value)) {
        if (metaValue.preventOverflow) {
            value = (value < 0 ? 0 : (value > 4294967295 ? 4294967295 : value));
        }
        else if (!metaValue.allowOverflow) {
            console.assert(value >= 0 && value <= 4294967295, 'Uint32 overflow', metaValue);
        }
        view.setUint32(0, value < 0 ? 0 : value > 4294967295 ? 4294967295 : value);
    }
    else if (metaValue.type === Types.i32 && isNumber(value)) {
        if (metaValue.preventOverflow) {
            value = (value < -2147483648 ? -2147483648 : (value > 2147483647 ? 2147483647 : value));
        }
        else if (!metaValue.allowOverflow) {
            console.assert(value >= -2147483648 && value <= 2147483647, 'Int32 overflow', metaValue);
        }
        view.setInt32(0, value);
    }
    else if (metaValue.type === Types.f32 && isNumber(value)) {
        view.setFloat32(0, value);
    }
    else if (metaValue.type === Types.f64 && isNumber(value)) {
        view.setFloat64(0, value);
    }
    else if (metaValue.type === Types.bool && isBoolean(value)) {
        view.setInt8(0, value === false ? 0 : 1);
    }
    else if ((metaValue.type === Types.str8 || metaValue.type === Types.str16 || metaValue.type === Types.str32) && metaValue._value instanceof Uint8Array) {
        metaValue._value.forEach((value, slot) => view.setUint8(slot, value));
    }
    else {
        console.error('Unknown metaValue.type', metaValue.type, value);
    }
    return byteLength;
};
function getByteLength(value) {
    let byteLength;
    if (value.type === Types.f64) {
        byteLength = 8;
    }
    else if (value.type === Types.i32 || value.type === Types.u32 || value.type === Types.f32) {
        byteLength = 4;
    }
    else if (value.type === Types.i16 || value.type === Types.u16) {
        byteLength = 2;
    }
    else if (value.type === Types.i8 || value.type === Types.u8 || value.type === Types.bool) {
        byteLength = 1;
    }
    else if (value.type === Types.str8 || value.type === Types.str16 || value.type === Types.str32) {
        if (value._value instanceof Uint8Array) {
            // Flattening
            byteLength = value._value.byteLength;
        }
        else {
            // Unflattening
            if (value.type === Types.str8) {
                byteLength = 1;
            }
            else if (value.type === Types.str16) {
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
        const { value: length, byteOffset: newOffset } = getValueFromBuffer(buffer, { type: Types.u32 }, options.byteOffset);
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
    console.assert(byteOffset + byteLength <= buffer.byteLength, `${byteOffset} + ${byteLength} <= ${buffer.byteLength}`);
    var view = new DataView(buffer, byteOffset, byteLength);
    if (metaValue.type === Types.u8) {
        value = view.getUint8(0);
    }
    else if (metaValue.type === Types.i8) {
        value = view.getInt8(0);
    }
    else if (metaValue.type === Types.u16) {
        value = view.getUint16(0);
    }
    else if (metaValue.type === Types.i16) {
        value = view.getInt16(0);
    }
    else if (metaValue.type === Types.u32) {
        value = view.getUint32(0);
    }
    else if (metaValue.type === Types.i32) {
        value = view.getInt32(0);
    }
    else if (metaValue.type === Types.f32) {
        value = view.getFloat32(0);
    }
    else if (metaValue.type === Types.f64) {
        value = view.getFloat64(0);
    }
    else if (metaValue.type === Types.bool) {
        value = view.getInt8(0) === 0 ? false : true;
    }
    else if (metaValue.type === Types.str8 || metaValue.type === Types.str16 || metaValue.type === Types.str32) {
        let strBufLen;
        let strBufStart;
        if (metaValue.type === Types.str8) {
            strBufLen = view.getUint8(0);
            byteLength += strBufLen;
            strBufStart = byteOffset + 1;
        }
        else if (metaValue.type === Types.str16) {
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
    const { sharedBuffer, returnCopy = false, } = extra;
    let { sizeInBytes, flatArray } = flatten(objects, template, {
        sizeInBytes: 0,
        flatArray: [],
        buffer: sharedBuffer,
    });
    let buffer;
    if (typeof sharedBuffer !== 'undefined') {
        buffer = sharedBuffer;
    }
    else {
        buffer = new ArrayBuffer(sizeInBytes);
    }
    // flatArray is empty if sharedBuffer is given
    let byteOffset = 0;
    flatArray.forEach(metaValue => {
        byteOffset += addToBuffer({
            buffer,
            metaValue,
            byteOffset,
        });
    });
    if (typeof sharedBuffer !== 'undefined' && returnCopy) {
        return buffer.slice(0, sizeInBytes);
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
    setTextHandler: exports.setTextHandler,
    Types,
};
exports.default = NetSerializer;
