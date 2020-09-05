'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
exports.setTextHandler = exports.unpack = exports.pack = exports.calculateBufferSize = exports.Types = void 0;
var isUndefined = function (val) { return typeof val === 'undefined'; };
var isBoolean = function (val) { return typeof val === 'boolean'; };
var isObject = function (val) { return val !== null && typeof val === 'object'; };
var isArray = function (val) { return typeof val === 'object' && Array.isArray(val); };
var isArrayTemplate = function (val) { return isArray(val) && (val.length === 1 || val.length === 2); };
var isNumber = function (val) { return typeof val === 'number'; };
var uint8Max = 255;
var int8Min = -128;
var int8Max = 127;
var uint16Max = 65535;
var int16Min = -32768;
var int16Max = 32767;
var uint32Max = 4294967295;
var int32Min = -2147483648;
var int32Max = 2147483647;
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
var isMetaValue = function (object) {
    if (typeof object.type === 'string') {
        return true;
    }
    return false;
};
function flatten(data, template, refObject) {
    var _a, _b;
    if (isArray(data) && isArrayTemplate(template)) {
        // Storing information how many elements there are
        var arraySize = {
            type: (_b = (_a = template[1]) === null || _a === void 0 ? void 0 : _a.lengthType) !== null && _b !== void 0 ? _b : Types.uint32
        };
        addToBuffer(refObject, arraySize, data.length);
        refObject.byteOffset += getByteLength(arraySize, data.length);
        if (isMetaValue(template[0])) {
            // Primitive value array
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var element = data_1[_i];
                addToBuffer(refObject, template[0], element);
                refObject.byteOffset += getByteLength(template[0]);
            }
        }
        else {
            for (var _c = 0, data_2 = data; _c < data_2.length; _c++) {
                var element = data_2[_c];
                if (!flatten(element, template[0], refObject))
                    return false;
            }
        }
    }
    else {
        for (var _d = 0, _e = Object.keys(template); _d < _e.length; _d++) {
            var key = _e[_d];
            var value = data[key];
            var templateValue = template[key];
            if (isObject(value)) {
                if (!flatten(value, templateValue, refObject))
                    return false;
            }
            else if (isNumber(value) || isBoolean(value)) {
                addToBuffer(refObject, templateValue, value);
                refObject.byteOffset += getByteLength(templateValue, value);
            }
            else if (typeof value === 'string') {
                var rawValue = encodeText(value);
                // Storing length of bytes of string
                // assertStringLength(templateValue.type, rawValue, key)
                var type = getTypeForStringLength(templateValue.type);
                var stringLength = { type: type };
                addToBuffer(refObject, stringLength, rawValue.byteLength);
                refObject.byteOffset += getByteLength(stringLength, rawValue.byteLength);
                // Storing value as Uint8Array of bytes
                addToBuffer(refObject, templateValue, rawValue);
                refObject.byteOffset += rawValue.byteLength;
            }
            else {
                if (isUndefined(value)) {
                    refObject.error = "Template property " + key + ", is not found from data " + data;
                }
                console.error('This error must be fixed! Otherwise unflattening won\'t work. Details below.');
                console.debug('data:', data, 'template:', template, 'key of template:', key);
                console.debug('is template[key] metavalue', isMetaValue(templateValue));
                return false;
            }
        }
    }
    return true;
}
exports.calculateBufferSize = function (data, template, size) {
    var _a, _b;
    if (size === void 0) { size = 0; }
    if (isArray(data) && isArrayTemplate(template)) {
        // Storing information how many elements there are
        var arraySize = {
            type: (_b = (_a = template[1]) === null || _a === void 0 ? void 0 : _a.lengthType) !== null && _b !== void 0 ? _b : Types.uint32
        };
        size += getByteLength(arraySize, data.length);
        if (data.length > 0) {
            if (isMetaValue(template[0])) {
                // Primitive value array
                size += getByteLength(template[0]) * data.length;
            }
            else {
                size += exports.calculateBufferSize(data[0], template[0]) * data.length;
            }
        }
    }
    else {
        Object.keys(template).forEach(function (key) {
            var value = data[key];
            var templateValue = template[key];
            if (isObject(value)) {
                size += exports.calculateBufferSize(value, templateValue);
            }
            else if (isNumber(value) || isBoolean(value)) {
                size += getByteLength(templateValue, value);
            }
            else if (typeof value === 'string') {
                var rawValue = encodeText(value);
                // Storing length of bytes of string
                var type = getTypeForStringLength(templateValue.type);
                var stringLength = { type: type };
                size += getByteLength(stringLength, rawValue.byteLength);
                // Storing value as Uint8Array of bytes
                size += rawValue.byteLength;
            }
        });
    }
    return size;
};
var getTypeForStringLength = function (type) {
    if (type === Types.string8) {
        return Types.uint8;
    }
    else if (type === Types.string16) {
        return Types.uint16;
    }
    return Types.uint32;
};
function addToBuffer(refObject, metaValue, value) {
    var byteLength = getByteLength(metaValue, value);
    var view = new DataView(refObject.buffer, refObject.byteOffset, byteLength);
    if (isNumber(metaValue.multiplier) && isNumber(value)) {
        value = value * metaValue.multiplier;
    }
    if (metaValue.type === Types.uint8) {
        if (metaValue.preventOverflow) {
            value = (value < 0 ? 0 : (value > uint8Max ? uint8Max : value));
        }
        view.setUint8(0, value);
    }
    else if (metaValue.type === Types.int8) {
        if (metaValue.preventOverflow) {
            value = (value < int8Min ? int8Min : (value > int8Max ? int8Max : value));
        }
        view.setInt8(0, value);
    }
    else if (metaValue.type === Types.boolean) {
        view.setInt8(0, value === false ? 0 : 1);
    }
    else if (metaValue.type === Types.uint16) {
        if (metaValue.preventOverflow) {
            value = (value < 0 ? 0 : (value > uint16Max ? uint16Max : value));
        }
        view.setUint16(0, value);
    }
    else if (metaValue.type === Types.int16) {
        if (metaValue.preventOverflow) {
            value = (value < int16Min ? int16Min : (value > int16Max ? int16Max : value));
        }
        view.setInt16(0, value);
    }
    else if (metaValue.type === Types.uint32) {
        if (metaValue.preventOverflow) {
            value = (value < 0 ? 0 : (value > uint32Max ? uint32Max : value));
        }
        view.setUint32(0, value);
    }
    else if (metaValue.type === Types.int32) {
        if (metaValue.preventOverflow) {
            value = (value < int32Min ? int32Min : (value > int32Max ? int32Max : value));
        }
        view.setInt32(0, value);
    }
    else if (metaValue.type === Types.float32) {
        view.setFloat32(0, value);
    }
    else if (metaValue.type === Types.float64) {
        view.setFloat64(0, value);
    }
    else {
        if (metaValue.type === Types.string8 || metaValue.type === Types.string16 || metaValue.type === Types.string) {
            if (value instanceof Uint8Array) {
                value.forEach(function (value, slot) { return view.setUint8(slot, value); });
            }
            else {
                console.error('Unknown metaValue.type', metaValue.type, value);
            }
        }
        else {
            console.error('Unknown metaValue.type', metaValue.type, value);
        }
    }
    return byteLength;
}
function getByteLength(metaValue, value) {
    var byteLength = 0;
    if (metaValue.type === Types.int8 || metaValue.type === Types.uint8 || metaValue.type === Types.boolean) {
        byteLength = 1;
    }
    else if (metaValue.type === Types.int16 || metaValue.type === Types.uint16) {
        byteLength = 2;
    }
    else if (metaValue.type === Types.int32 || metaValue.type === Types.uint32 || metaValue.type === Types.float32) {
        byteLength = 4;
    }
    else if (metaValue.type === Types.string8 || metaValue.type === Types.string16 || metaValue.type === Types.string) {
        if (value instanceof Uint8Array) {
            // Flattening
            byteLength = value.byteLength;
        }
        else {
            // Unflattening
            if (metaValue.type === Types.string8) {
                byteLength = 1;
            }
            else if (metaValue.type === Types.string16) {
                byteLength = 2;
            }
            else {
                byteLength = 4; // Slot for length of the text as bytes
            }
        }
    }
    else if (metaValue.type === Types.float64) {
        byteLength = 8;
    }
    return byteLength;
}
function unflatten(buffer, template, options) {
    var _a, _b, _c, _d;
    var result;
    if (isArrayTemplate(template)) {
        result = [];
        var value = getValueFromBuffer(buffer, { type: (_b = (_a = template[1]) === null || _a === void 0 ? void 0 : _a.lengthType) !== null && _b !== void 0 ? _b : Types.uint32 }, options);
        var itemCallback = (_d = (_c = template[1]) === null || _c === void 0 ? void 0 : _c.unpackCallback) !== null && _d !== void 0 ? _d : null;
        for (var i = 0; i < (isNumber(value) ? value : 0); i++) {
            var item = unflatten(buffer, template[0], options);
            if (itemCallback) {
                item = itemCallback(item);
                if (typeof item !== 'undefined' && item !== null) {
                    result.push(item);
                }
            }
            else {
                result.push(item);
            }
        }
    }
    else if (isMetaValue(template)) {
        result = getValueFromBuffer(buffer, template, options);
    }
    else {
        result = {};
        Object.keys(template).forEach(function (key) {
            if (isMetaValue(template[key])) {
                result[key] = getValueFromBuffer(buffer, template[key], options);
            }
            else {
                result[key] = unflatten(buffer, template[key], options);
            }
        });
    }
    return result;
}
function getValueFromBuffer(buffer, metaValue, ref) {
    var value;
    var byteLength = getByteLength(metaValue);
    var view = new DataView(buffer, ref.byteOffset, byteLength);
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
        var strBufLen = void 0;
        var strBufStart = void 0;
        if (metaValue.type === Types.string8) {
            strBufLen = view.getUint8(0);
            byteLength += strBufLen;
            strBufStart = ref.byteOffset + 1;
        }
        else if (metaValue.type === Types.string16) {
            strBufLen = view.getUint16(0);
            byteLength += strBufLen;
            strBufStart = ref.byteOffset + 2;
        }
        else {
            strBufLen = view.getUint32(0);
            byteLength += strBufLen;
            strBufStart = ref.byteOffset + 4;
        }
        var strBufEnd = strBufStart + strBufLen;
        value = decodeText(buffer.slice(strBufStart, strBufEnd));
    }
    if (isNumber(metaValue.multiplier) && isNumber(value)) {
        value = value / metaValue.multiplier;
    }
    ref.byteOffset += byteLength;
    return value;
}
exports.pack = function (object, template, extra) {
    if (extra === void 0) { extra = {}; }
    var sharedBuffer = extra.sharedBuffer, _a = extra.returnCopy, returnCopy = _a === void 0 ? false : _a, _b = extra.freeBytes, freeBytes = _b === void 0 ? 0 : _b, bufferSizeInBytes = extra.bufferSizeInBytes;
    var sizeInBytes = bufferSizeInBytes !== null && bufferSizeInBytes !== void 0 ? bufferSizeInBytes : exports.calculateBufferSize(object, template);
    var buffer;
    if (typeof sharedBuffer !== 'undefined') {
        buffer = sharedBuffer;
    }
    else {
        buffer = new ArrayBuffer(sizeInBytes + freeBytes);
    }
    var ref = {
        byteOffset: 0,
        buffer: buffer,
        error: '',
    };
    var success = flatten(object, template, ref);
    if (!success && typeof extra.onErrorCallback === 'function') {
        extra.onErrorCallback(ref.error);
    }
    if (typeof sharedBuffer !== 'undefined' && returnCopy) {
        return buffer.slice(0, sizeInBytes);
    }
    return buffer;
};
exports.unpack = function (buffer, template) {
    return unflatten(buffer, template, { byteOffset: 0 });
};
var MakeDecoderFn = function (decoder) { return function (input) { return decoder.decode(input); }; };
var decodeText;
var setTextDecoder = function (decoder) {
    decodeText = MakeDecoderFn(decoder);
};
if (typeof TextDecoder === 'function') {
    setTextDecoder(new TextDecoder());
}
var MakeEncoderFn = function (encoder) { return function (input) { return encoder.encode(input); }; };
var encodeText;
var setTextEncoder = function (encoder) {
    encodeText = MakeEncoderFn(encoder);
};
if (typeof TextEncoder === 'function') {
    setTextEncoder(new TextEncoder());
}
exports.setTextHandler = function (handler) {
    encodeText = MakeEncoderFn(handler);
    decodeText = MakeDecoderFn(handler);
};
var NetSerializer = {
    pack: exports.pack,
    unpack: exports.unpack,
    utils: {
        setTextHandler: exports.setTextHandler,
        calculateBufferSize: exports.calculateBufferSize,
        Types: Types,
    }
};
exports.default = NetSerializer;
