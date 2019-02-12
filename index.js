"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isUndefined = (val) => typeof val === 'undefined';
const isBoolean = (val) => typeof val === 'boolean';
const isObject = (val) => typeof val === 'object';
const isArray = (val) => typeof val === 'object' && Array.isArray(val);
const isNumber = (val) => (typeof val === 'number' && isFinite(val)) || (val !== '' && isFinite(Number(val)));
const uint8Max = 255;
const int8Min = -128;
const int8Max = 127;
const uint16Max = 65535;
const int16Min = -32768;
const int16Max = 32767;
const uint32Max = 4294967295;
const int32Min = -2147483648;
const int32Max = 2147483647;
var Types;
(function (Types) {
    Types["int8"] = "int8";
    Types["uint8"] = "uint8";
    Types["int16"] = "int16";
    Types["uint16"] = "uint16";
    Types["int32"] = "int32";
    Types["uint32"] = "uint32";
    Types["float32"] = "float32";
    Types["float64"] = "float64";
    Types["boolean"] = "boolean";
    Types["string8"] = "string8";
    Types["string16"] = "string16";
    Types["string"] = "string";
})(Types = exports.Types || (exports.Types = {}));
const isMetaValue = (object) => {
    if (typeof object.type === 'string') {
        return true;
    }
    return false;
};
const defaultTemplateOptions = {
    arrayMaxLength: Types.uint32
};
const defaultRefObject = {
    sizeInBytes: 0,
    flatArray: [],
    templateOptions: defaultTemplateOptions
};
function flatten(data, template, refObject = defaultRefObject) {
    if (isArray(data) && isArray(template)) {
        assertArrayLength(refObject, data);
        // Storing information how many elements there are
        const arrayLength = {
            _value: data.length,
            type: refObject.templateOptions.arrayMaxLength
        };
        processMetaValue(refObject, arrayLength);
        refObject.sizeInBytes += getByteLength(arrayLength);
        data.forEach((element) => {
            if (isObject(element)) {
                flatten(element, template[0], refObject);
            }
            else {
                // Add support for numeric arrays
                console.warn('Element of the array must be an object (numeric elements are not supported yet)');
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
                const rawValue = encodeText(value);
                const dataCopy = Object.assign({ _value: rawValue }, templateValue);
                // Storing length of bytes in string
                assertStringLength(templateValue.type, rawValue, key);
                const type = getTypeForStringLength(templateValue.type);
                const stringLength = { _value: rawValue.byteLength, type };
                processMetaValue(refObject, stringLength);
                refObject.sizeInBytes += getByteLength(stringLength);
                // Storing value as Uint8Array of bytes
                processMetaValue(refObject, dataCopy);
                refObject.sizeInBytes += rawValue.byteLength;
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
const getTypeForStringLength = (type) => {
    if (type === Types.string8) {
        return Types.uint8;
    }
    else if (type === Types.string16) {
        return Types.uint16;
    }
    return Types.uint32;
};
function assertStringLength(type, rawValue, key) {
    if (type === Types.string8) {
        console.assert(rawValue.byteLength <= uint8Max, `Error in value of property "${key}": string is too long for uint8 slot (${rawValue.byteLength})`);
    }
    else if (type === Types.string16) {
        console.assert(rawValue.byteLength <= uint16Max, `Error in value of property "${key}": string is too long for uint16 slot (${rawValue.byteLength})`);
    }
    else if (type === Types.string) {
        console.assert(rawValue.byteLength <= uint32Max, `Error in value of property "${key}": string is too long for uint32 slot (${rawValue.byteLength})`);
    }
}
function assertArrayLength(refObject, data) {
    if (refObject.templateOptions.arrayMaxLength === Types.uint8) {
        console.assert(data.length <= uint8Max, `Array is too long (${data.length}) for the length type uint8`);
    }
    else if (refObject.templateOptions.arrayMaxLength === Types.uint16) {
        console.assert(data.length <= uint16Max, `Array is too long (${data.length}) for the length type uint16`);
    }
    else if (refObject.templateOptions.arrayMaxLength === Types.uint32) {
        console.assert(data.length <= uint32Max, `Array is too long (${data.length}) for the length type uint32`);
    }
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
    if (metaValue.type === Types.uint8 && isNumber(value)) {
        if (metaValue.preventOverflow) {
            value = (value < 0 ? 0 : (value > uint8Max ? uint8Max : value));
        }
        console.assert(value >= 0 && value <= uint8Max, 'Uint8 overflow', metaValue);
        view.setUint8(0, value);
    }
    else if (metaValue.type === Types.int8 && isNumber(value)) {
        if (metaValue.preventOverflow) {
            value = (value < int8Min ? int8Min : (value > int8Max ? int8Max : value));
        }
        console.assert(value >= int8Min && value <= int8Max, 'Int8 overflow', metaValue);
        view.setInt8(0, value);
    }
    else if (metaValue.type === Types.uint16 && isNumber(value)) {
        if (metaValue.preventOverflow) {
            value = (value < 0 ? 0 : (value > uint16Max ? uint16Max : value));
        }
        console.assert(value >= 0 && value <= uint16Max, 'Uint16 overflow', metaValue);
        view.setUint16(0, value);
    }
    else if (metaValue.type === Types.int16 && isNumber(value)) {
        if (metaValue.preventOverflow) {
            value = (value < int16Min ? int16Min : (value > int16Max ? int16Max : value));
        }
        console.assert(value >= int16Min && value <= int16Max, 'Int16 overflow', metaValue);
        view.setInt16(0, value);
    }
    else if (metaValue.type === Types.uint32 && isNumber(value)) {
        if (metaValue.preventOverflow) {
            value = (value < 0 ? 0 : (value > uint32Max ? uint32Max : value));
        }
        console.assert(value >= 0 && value <= uint32Max, 'Uint32 overflow', metaValue);
        view.setUint32(0, value);
    }
    else if (metaValue.type === Types.int32 && isNumber(value)) {
        if (metaValue.preventOverflow) {
            value = (value < int32Min ? int32Min : (value > int32Max ? int32Max : value));
        }
        console.assert(value >= int32Min && value <= int32Max, 'Int32 overflow', metaValue);
        view.setInt32(0, value);
    }
    else if (metaValue.type === Types.float32 && isNumber(value)) {
        view.setFloat32(0, value);
    }
    else if (metaValue.type === Types.float64 && isNumber(value)) {
        view.setFloat64(0, value);
    }
    else if (metaValue.type === Types.boolean && isBoolean(value)) {
        view.setInt8(0, value === false ? 0 : 1);
    }
    else if ((metaValue.type === Types.string8 || metaValue.type === Types.string16 || metaValue.type === Types.string) && metaValue._value instanceof Uint8Array) {
        metaValue._value.forEach((value, slot) => view.setUint8(slot, value));
    }
    else {
        console.error('Unknown metaValue.type', metaValue.type, value);
    }
    return byteLength;
};
function getByteLength(value) {
    let byteLength;
    if (value.type === Types.float64) {
        byteLength = 8;
    }
    else if (value.type === Types.int32 || value.type === Types.uint32 || value.type === Types.float32) {
        byteLength = 4;
    }
    else if (value.type === Types.int16 || value.type === Types.uint16) {
        byteLength = 2;
    }
    else if (value.type === Types.int8 || value.type === Types.uint8 || value.type === Types.boolean) {
        byteLength = 1;
    }
    else if (value.type === Types.string8 || value.type === Types.string16 || value.type === Types.string) {
        if (value._value instanceof Uint8Array) {
            // Flattening
            byteLength = value._value.byteLength;
        }
        else {
            // Unflattening
            if (value.type === Types.string8) {
                byteLength = 1;
            }
            else if (value.type === Types.string16) {
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
        const { value: length, byteOffset: newOffset } = getValueFromBuffer(buffer, { type: options.templateOptions.arrayMaxLength }, options.byteOffset);
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
    if (metaValue.type === Types.uint8) {
        value = view.getUint8(0);
    }
    else if (metaValue.type === Types.int8) {
        value = view.getInt8(0);
    }
    else if (metaValue.type === Types.uint16) {
        value = view.getUint16(0);
    }
    else if (metaValue.type === Types.int16) {
        value = view.getInt16(0);
    }
    else if (metaValue.type === Types.uint32) {
        value = view.getUint32(0);
    }
    else if (metaValue.type === Types.int32) {
        value = view.getInt32(0);
    }
    else if (metaValue.type === Types.float32) {
        value = view.getFloat32(0);
    }
    else if (metaValue.type === Types.float64) {
        value = view.getFloat64(0);
    }
    else if (metaValue.type === Types.boolean) {
        value = view.getInt8(0) === 0 ? false : true;
    }
    else if (metaValue.type === Types.string8 || metaValue.type === Types.string16 || metaValue.type === Types.string) {
        let strBufLen;
        let strBufStart;
        if (metaValue.type === Types.string8) {
            strBufLen = view.getUint8(0);
            byteLength += strBufLen;
            strBufStart = byteOffset + 1;
        }
        else if (metaValue.type === Types.string16) {
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
exports.pack = (object, template, extra = {}) => {
    const { sharedBuffer, returnCopy = false, } = extra;
    let templateOptions = defaultTemplateOptions;
    if (typeof template._netSerializer_ === 'object') {
        templateOptions = Object.assign({}, templateOptions, template._netSerializer_.options);
        template = template._netSerializer_.template;
    }
    let { sizeInBytes, flatArray } = flatten(object, template, {
        sizeInBytes: 0,
        flatArray: [],
        buffer: sharedBuffer,
        templateOptions,
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
    let templateOptions = defaultTemplateOptions;
    if (typeof template._netSerializer_ === 'object') {
        templateOptions = Object.assign({}, templateOptions, template._netSerializer_.options);
        template = template._netSerializer_.template;
    }
    return unflatten(buffer, template, { byteOffset: 0, templateOptions });
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
