const isUndefined = (val: any): val is undefined => typeof val === 'undefined';
const isBoolean = (val: any): val is boolean => typeof val === 'boolean';
const isObject = (val: any): val is object => val !== null && typeof val === 'object';
const isArray = (val: any): val is Array<any> => typeof val === 'object' && Array.isArray(val);
const isArrayTemplate = (val: any): val is ArrayTemplate => isArray(val) && (val.length === 1 || val.length === 2);
const isNumber = (val: any): val is number => typeof val === 'number'

const uint8Max = 255
const int8Min = -128
const int8Max = 127

const uint16Max = 65535
const int16Min = -32768
const int16Max = 32767

const uint32Max = 4294967295
const int32Min = -2147483648
const int32Max = 2147483647

export enum Types {
	int8 = 'int8',
	uint8 = 'uint8',
	int16 = 'int16',
	uint16 = 'uint16',
	int32 = 'int32',
	uint32 = 'uint32',
	float32 = 'float32',
	float64 = 'float64',
	boolean = 'boolean',
	string8 = 'string8',
	string16 = 'string16',
	string = 'string',
}

type metaValueType = 'int8' | 'uint8' | 'int16' | 'uint16' | 'int32' | 'uint32' | 'float32' | 'float64' | 'boolean' | 'string' | 'string8' | 'string16'

export interface IMetaValue {
	type: metaValueType
	multiplier?: number
	preventOverflow?: boolean
}
const isMetaValue = (object: any): object is IMetaValue => {
	if (typeof object.type === 'string') {
		return true
	}
	return false
}

interface InternalMetaValue extends IMetaValue {
	_value?: number | boolean | Uint8Array
}

interface ArrayOptions {
	lengthType?: Types.uint8 | Types.uint16 | Types.uint32
	unpackCallback?: (item: any) => any
}

export type ArrayTemplate<T = any> = [T, ArrayOptions?]

interface RefObject {
	byteOffset: number
	buffer: ArrayBuffer
	view: DataView
	onErrorCallback?: (error: string) => void
}

function flatten(data: any, template: any, refObject: RefObject) {

	if (isArray(data) && isArrayTemplate(template)) {
		// Storing information how many elements there are
		const arraySize: InternalMetaValue = {
			type: template[1]?.lengthType ?? Types.uint32
		}
		refObject.byteOffset += addToBuffer(refObject, arraySize, data.length);
		if (isMetaValue(template[0])) {
			// Primitive value array
			for (let element of data) {
				refObject.byteOffset += addToBuffer(refObject, template[0], element)
			}
		} else {
			for (let element of data) {
				flatten(element, template[0], refObject)
			}
		}
	} else {
		for (let key of Object.keys(template)) {
			const value = data[key]
			const templateValue = template[key]
			if (isObject(value)) {
				flatten(value, templateValue, refObject)
			}
			else if (isNumber(value) || isBoolean(value)) {
				refObject.byteOffset += addToBuffer(refObject, templateValue, value)
			}
			else if (typeof value === 'string') {
				const rawValue = encodeText(value)
				// Storing length of bytes of string
				// assertStringLength(templateValue.type, rawValue, key)
				const type = getTypeForStringLength(templateValue.type)
				const stringLength: InternalMetaValue = { type }
				refObject.byteOffset += addToBuffer(refObject, stringLength, rawValue.byteLength)
				// Storing value as Uint8Array of bytes
				addToBuffer(refObject, templateValue, rawValue)
				refObject.byteOffset += rawValue.byteLength
			}
			else {
				let error = ''
				if (isUndefined(value)) {
					error = `Template property ${key}, is not found from data ${data}`
				}
				console.error('This error must be fixed! Otherwise unflattening won\'t work. Details below.')
				console.debug('data:', data, 'template:', template, 'key of template:', key)
				console.debug('is template[key] metavalue', isMetaValue(templateValue))
				if (typeof refObject.onErrorCallback === 'function') {
					refObject.onErrorCallback(error)
				}
				throw Error(error)
			}
		}
	}
}

export const calculateBufferSize = (data: any, template: any, size = 0) => {

	if (isArray(data) && isArrayTemplate(template)) {
		// Storing information how many elements there are
		const arraySize: InternalMetaValue = {
			type: template[1]?.lengthType ?? Types.uint32
		}
		size += getByteLength(arraySize, data.length)
		if (data.length > 0) {
			if (isMetaValue(template[0])) {
				// Primitive value array
				size += getByteLength(template[0]) * data.length
			} else {
				for (let element of data)
					size += calculateBufferSize(element, template[0])
			}
		}
	} else {
		Object.keys(template).forEach(key => {
			const value = data[key]
			const templateValue = template[key]
			if (isObject(value)) {
				size += calculateBufferSize(value, templateValue)
			}
			else if (isNumber(value) || isBoolean(value)) {
				size += getByteLength(templateValue, value)
			}
			else if (typeof value === 'string') {
				const rawValue = encodeText(value)
				// Storing length of bytes of string
				const type = getTypeForStringLength(templateValue.type)
				const stringLength: InternalMetaValue = { type }
				size += getByteLength(stringLength, rawValue.byteLength)
				// Storing value as Uint8Array of bytes
				size += rawValue.byteLength
			}
		})
	}

	return size
}

const getTypeForStringLength = (type: metaValueType): Types.uint8 | Types.uint16 | Types.uint32 => {
	if (type === Types.string8) {
		return Types.uint8
	} else if (type === Types.string16) {
		return Types.uint16
	}
	return Types.uint32
}

function addToBuffer(refObject: RefObject, metaValue: Readonly<InternalMetaValue>, value: any) {

	let byteLength = 0

	if (isNumber(metaValue.multiplier) && isNumber(value)) {
		value = value * metaValue.multiplier
	}

	if (metaValue.type === Types.uint8) {
		if (metaValue.preventOverflow) {
			value = (value < 0 ? 0 : (value > uint8Max ? uint8Max : value))
		}
		refObject.view.setUint8(refObject.byteOffset, value);
		byteLength = 1
	}
	else if (metaValue.type === Types.int8) {
		if (metaValue.preventOverflow) {
			value = (value < int8Min ? int8Min : (value > int8Max ? int8Max : value))
		}
		refObject.view.setInt8(refObject.byteOffset, value);
		byteLength = 1
	}
	else if (metaValue.type === Types.boolean) {
		refObject.view.setInt8(refObject.byteOffset, value === false ? 0 : 1);
		byteLength = 1
	}
	else if (metaValue.type === Types.uint16) {
		if (metaValue.preventOverflow) {
			value = (value < 0 ? 0 : (value > uint16Max ? uint16Max : value))
		}
		refObject.view.setUint16(refObject.byteOffset, value);
		byteLength = 2
	}
	else if (metaValue.type === Types.int16) {
		if (metaValue.preventOverflow) {
			value = (value < int16Min ? int16Min : (value > int16Max ? int16Max : value))
		}
		refObject.view.setInt16(refObject.byteOffset, value);
		byteLength = 2
	}
	else if (metaValue.type === Types.uint32) {
		if (metaValue.preventOverflow) {
			value = (value < 0 ? 0 : (value > uint32Max ? uint32Max : value))
		}
		refObject.view.setUint32(refObject.byteOffset, value);
		byteLength = 4
	}
	else if (metaValue.type === Types.int32) {
		if (metaValue.preventOverflow) {
			value = (value < int32Min ? int32Min : (value > int32Max ? int32Max : value))
		}
		refObject.view.setInt32(refObject.byteOffset, value);
		byteLength = 4
	}
	else if (metaValue.type === Types.float32) {
		refObject.view.setFloat32(refObject.byteOffset, value);
		byteLength = 4
	}
	else if (metaValue.type === Types.float64) {
		refObject.view.setFloat64(refObject.byteOffset, value);
		byteLength = 8
	}
	else {
		if (metaValue.type === Types.string8 || metaValue.type === Types.string16 || metaValue.type === Types.string) {
			if (value instanceof Uint8Array) {
				value.forEach((value, slot) => refObject.view.setUint8(slot + refObject.byteOffset, value))
			} else {
				console.error('Unknown metaValue.type', metaValue.type, value)
			}
		}
		else {
			console.error('Unknown metaValue.type', metaValue.type, value)
		}
		byteLength = value
	}

	return byteLength
}

function getByteLength(metaValue: Readonly<InternalMetaValue>, value?: any) {

	let byteLength = 0;

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
			byteLength = value.byteLength
		} else {
			// Unflattening
			if (metaValue.type === Types.string8) {
				byteLength = 1
			} else if (metaValue.type === Types.string16) {
				byteLength = 2
			} else {
				byteLength = 4 // Slot for length of the text as bytes
			}
		}
	}
	else if (metaValue.type === Types.float64) {
		byteLength = 8;
	}

	return byteLength;
}

type TOption = {
	byteOffset: number;
	view: DataView;
};

function unflatten(buffer: ArrayBuffer, template: any, options: TOption) {

	let result: any

	if (isArrayTemplate(template)) {
		result = [];
		const value = getValueFromBuffer(buffer, { type: template[1]?.lengthType ?? Types.uint32 }, options)
		const itemCallback = template[1]?.unpackCallback ?? null
		for (let i = 0; i < (isNumber(value) ? value : 0); i++) {
			let item = unflatten(buffer, template[0], options);
			if (itemCallback) {
				item = itemCallback(item)
				if (typeof item !== 'undefined' && item !== null) {
					result.push(item)
				}
			} else {
				result.push(item)
			}
		}
	}
	else if (isMetaValue(template)) {
		result = getValueFromBuffer(buffer, template, options)
	}
	else {
		result = {};
		Object.keys(template).forEach(key => {
			if (isMetaValue(template[key])) {
				result[key] = getValueFromBuffer(buffer, template[key], options)
			} else {
				result[key] = unflatten(buffer, template[key], options)
			}
		})
	}

	return result
}

function getValueFromBuffer(buffer: ArrayBuffer, metaValue: InternalMetaValue, ref: TOption) {

	let value;
	let byteLength = 0

	if (metaValue.type === Types.uint8) {
		value = ref.view.getUint8(ref.byteOffset)
		byteLength = 1
	} else if (metaValue.type === Types.int8) {
		value = ref.view.getInt8(ref.byteOffset)
		byteLength = 1
	}
	else if (metaValue.type === Types.boolean) {
		value = ref.view.getInt8(ref.byteOffset) === 0 ? false : true
		byteLength = 1
	}
	else if (metaValue.type === Types.uint16) {
		value = ref.view.getUint16(ref.byteOffset)
		byteLength = 2
	} else if (metaValue.type === Types.int16) {
		value = ref.view.getInt16(ref.byteOffset)
		byteLength = 2
	}
	else if (metaValue.type === Types.uint32) {
		value = ref.view.getUint32(ref.byteOffset)
		byteLength = 4
	} else if (metaValue.type === Types.int32) {
		value = ref.view.getInt32(ref.byteOffset)
		byteLength = 4
	}
	else if (metaValue.type === Types.float32) {
		value = ref.view.getFloat32(ref.byteOffset)
		byteLength = 4
	}
	else if (metaValue.type === Types.float64) {
		value = ref.view.getFloat64(ref.byteOffset)
		byteLength = 8
	}
	else if (metaValue.type === Types.string8 || metaValue.type === Types.string16 || metaValue.type === Types.string) {
		byteLength = getByteLength(metaValue)
		let strBufLen: number
		let strBufStart: number
		if (metaValue.type === Types.string8) {
			strBufLen = ref.view.getUint8(ref.byteOffset)
			byteLength += strBufLen
			strBufStart = ref.byteOffset + 1
		} else if (metaValue.type === Types.string16) {
			strBufLen = ref.view.getUint16(ref.byteOffset)
			byteLength += strBufLen
			strBufStart = ref.byteOffset + 2
		} else {
			strBufLen = ref.view.getUint32(ref.byteOffset)
			byteLength += strBufLen
			strBufStart = ref.byteOffset + 4
		}
		const strBufEnd = strBufStart + strBufLen
		value = decodeText(buffer.slice(strBufStart, strBufEnd))
	}

	if (isNumber(metaValue.multiplier) && isNumber(value)) {
		value = value / metaValue.multiplier
	}

	ref.byteOffset += byteLength

	return value;
}

interface packExtraParams {
	sharedBuffer?: ArrayBuffer
	returnCopy?: boolean
	freeBytes?: number
	bufferSizeInBytes?: number
	onErrorCallback?: (error: string) => void
}

export const pack = (object: any, template: any, extra: packExtraParams = {}) => {

	const {
		sharedBuffer,
		returnCopy = false,
		freeBytes = 0,
		bufferSizeInBytes,
	} = extra

	const sizeInBytes = bufferSizeInBytes ?? calculateBufferSize(object, template)

	let buffer: ArrayBuffer
	if (typeof sharedBuffer !== 'undefined') {
		buffer = sharedBuffer
	} else {
		buffer = new ArrayBuffer(sizeInBytes + freeBytes)
	}

	const ref = {
		byteOffset: 0,
		buffer,
		view: new DataView(buffer),
		onErrorCallback: extra.onErrorCallback,
	}
	flatten(object, template, ref)

	if (typeof sharedBuffer !== 'undefined' && returnCopy) {
		return buffer.slice(0, sizeInBytes)
	}
	return buffer
}

export const unpack = (buffer: ArrayBuffer, template: any): any => {
	return unflatten(buffer, template, { byteOffset: 0, view: new DataView(buffer) })
}

type TDecodeText = (input: ArrayBuffer) => string
interface ITextDecoder {
	decode: (input: ArrayBuffer) => string
}
const MakeDecoderFn = (decoder: ITextDecoder) => (input: ArrayBuffer) => decoder.decode(input);
let decodeText: TDecodeText;
const setTextDecoder = (decoder: ITextDecoder) => {
	decodeText = MakeDecoderFn(decoder)
}
if (typeof TextDecoder === 'function') {
	setTextDecoder(new TextDecoder())
}

type TEncodeText = (input: string) => Uint8Array
interface ITextEncoder {
	encode: (input: string) => Uint8Array
}
const MakeEncoderFn = (encoder: ITextEncoder) => (input: string) => encoder.encode(input);
let encodeText: TEncodeText
const setTextEncoder = (encoder: ITextEncoder) => {
	encodeText = MakeEncoderFn(encoder)
}
if (typeof TextEncoder === 'function') {
	setTextEncoder(new TextEncoder())
}

interface ITextHandler {
	encode: (input: string) => Uint8Array
	decode: (input: ArrayBuffer) => string
}
export const setTextHandler = (handler: ITextHandler) => {
	encodeText = MakeEncoderFn(handler)
	decodeText = MakeDecoderFn(handler)
}

const NetSerializer = {
	pack,
	unpack,
	utils: {
		setTextHandler,
		calculateBufferSize,
		Types,
	}
}
export default NetSerializer