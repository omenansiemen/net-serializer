const isUndefined = (val: any): val is undefined => typeof val === 'undefined'
const isBoolean = (val: any): val is boolean => typeof val === 'boolean'
const isObject = (val: any): val is object => val !== null && typeof val === 'object'
const isArray = (val: any): val is Array<any> => typeof val === 'object' && Array.isArray(val)
const isArrayTemplate = (val: any): val is ArrayTemplate => isArray(val) && (val.length === 1 || val.length === 2)
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

interface ILimits {
	uint8Max: typeof uint8Max
	int8Min: typeof int8Min
	int8Max: typeof int8Max
	uint16Max: typeof uint16Max
	int16Min: typeof int16Min
	int16Max: typeof int16Max
	uint32Max: typeof uint32Max
	int32Min: typeof int32Min
	int32Max: typeof int32Max
}
export const Limits: ILimits = {
	uint8Max,
	int8Min,
	int8Max,
	uint16Max,
	int16Min,
	int16Max,
	uint32Max,
	int32Min,
	int32Max,
}

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

type SerializableObjectTypes = Object | number | boolean | string

export interface IMetaValue {
	type: Types
	multiplier?: number
	preventOverflow?: boolean
	/**
	 * Extreme type limits are used to store Infinity. Turns preventOverflow on internaly.
	 */
	infinity?: boolean
	/**
	 * multiplier property is disabled when compress is defined
	 */
	compress?: {
		/**
		 * @param prop	Value of object's property being serialized
		 */
		pack: (prop: SerializableObjectTypes) => number
		/**
		 * @param value serialized data made by pack function
		 * @return deserialized object that was given to pack function
		 */
		unpack: (value: number) => SerializableObjectTypes
	}
}
const isMetaValue = (object: any): object is IMetaValue => {
	if (typeof object.type === 'string') {
		return true
	}
	return false
}

interface ArrayOptions {
	lengthType?: Types.uint8 | Types.uint16 | Types.uint32
	/**
	 * Set this to true if array template does not contain any array
	 */
	pure?: boolean
	unpackCallback?: (item: any) => any
}

export type ArrayTemplate<T = any> = [T, ArrayOptions?]

interface IError {
	onErrorCallback?: (error: string, callStack?: Array<object>) => void
}
interface RefObject extends IError {
	byteOffset: number
	view: DataView
}

function flatten(data: any, template: any, ref: RefObject) {

	if (isArrayTemplate(template)) {
		// Storing information how many elements there are
		const arraySize: IMetaValue = {
			type: template[1]?.lengthType ?? Types.uint32
		}
		ref.byteOffset += addToBuffer(ref, arraySize, data.length)
		if (isMetaValue(template[0])) {
			// Primitive value array
			for (let element of data) {
				ref.byteOffset += addToBuffer(ref, template[0], element)
			}
		} else {
			for (let element of data) {
				flatten(element, template[0], ref)
			}
		}
	} else {
		for (let key in template) {
			const value = data[key]
			const templateValue = template[key]
			if (isNumber(value) || isBoolean(value)) {
				ref.byteOffset += addToBuffer(ref, templateValue, value)
			}
			else if (isObject(value)) {
				if (isMetaValue(templateValue) && templateValue.compress) {
					ref.byteOffset += addToBuffer(
						ref,
						templateValue,
						value,
					)
				} else {
					flatten(value, templateValue, ref)
				}
			}
			else if (typeof value === 'string') {
				const rawValue = encodeText(value)
				// Storing length of bytes of string
				// assertStringLength(templateValue.type, rawValue, key)
				const type = getTypeForStringLength(templateValue.type)
				const stringLength: IMetaValue = { type }
				ref.byteOffset += addToBuffer(ref, stringLength, rawValue.byteLength)
				// Storing value as Uint8Array of bytes
				ref.byteOffset += addToBuffer(ref, templateValue, rawValue)
			}
			else {
				let error = ''
				if (isUndefined(value)) {
					error = `Template property ${key}, is not found from data ${data}.`
				}
				console.error('This error must be fixed! Otherwise unflattening won\'t work. Details below.')
				console.debug('data:', data, 'template:', template, 'key of template:', key)
				console.debug('is template[key] metavalue', isMetaValue(templateValue))
				if (typeof ref.onErrorCallback === 'function') {
					ref.onErrorCallback(error)
				}
				throw Error(error)
			}
		}
	}
}

type Indexable = {
	[key: string]: any
}

export const calculateBufferSize = <A extends Indexable, B extends Indexable = any>(data: A, template: B, size = 0): number => {

	if (isArrayTemplate(template) && Array.isArray(data)) {
		dynamic = true
		// Storing information how many elements there are
		const arraySize: IMetaValue = {
			type: template[1]?.lengthType ?? Types.uint32
		}
		size += getByteLength(arraySize, data.length)
		if (data.length > 0) {
			if (isMetaValue(template[0])) {
				// Primitive value array
				const byteLengthOfElement = getByteLength(template[0])
				size += byteLengthOfElement * data.length
			} else {
				if (template[1]?.pure) {
					const sizeBeforeSizeCalculation = size
					size = calculateBufferSize(data[0], template[0], size)
					const templateSize = size - sizeBeforeSizeCalculation
					size += (data.length - 1) * templateSize
				} else {
					for (let i = 0; i < data.length; i++) {
						size = calculateBufferSize(data[i], template[0], size)
					}
				}
			}
		}
	} else {
		for (const key in template) {
			const value = data[key]
			const templateValue = template[key]
			if (isNumber(value) || isBoolean(value)) {
				size += getByteLength(templateValue)
			}
			else if (isObject(value)) {
				if (isMetaValue(templateValue) && templateValue.compress) {
					size += getByteLength(templateValue)
				} else {
					size = calculateBufferSize(value, templateValue, size)
				}
			}
			else if (typeof value === 'string') {
				dynamic = true
				const rawValue = encodeText(value)
				// Storing length of bytes of string
				const type = getTypeForStringLength(templateValue.type)
				const stringLength: IMetaValue = { type }
				size += getByteLength(stringLength, rawValue.byteLength)
				// Storing value as Uint8Array of bytes
				size += rawValue.byteLength
			}
		}
	}

	return size
}

const getTypeForStringLength = (type: Types): Types.uint8 | Types.uint16 | Types.uint32 => {
	if (type === Types.string8) {
		return Types.uint8
	} else if (type === Types.string16) {
		return Types.uint16
	}
	return Types.uint32
}

type ViewAndByteOffset = Pick<RefObject, 'view' | 'byteOffset'>
function addToBuffer(ref: ViewAndByteOffset, metaValue: Readonly<IMetaValue>, value: any): number {

	let byteLength = 0

	if (metaValue.compress) {
		value = metaValue.compress.pack(value)
	} else if (isNumber(metaValue.multiplier) && isNumber(value)) {
		value = value * metaValue.multiplier
	}

	if (metaValue.type === Types.uint8) {
		if (metaValue.preventOverflow || metaValue.infinity) {
			value = (value < 0 ? 0 : (value > uint8Max ? uint8Max : value))
		}
		ref.view.setUint8(ref.byteOffset, value)
		byteLength = 1
	}
	else if (metaValue.type === Types.int8) {
		if (metaValue.preventOverflow || metaValue.infinity) {
			value = (value < int8Min ? int8Min : (value > int8Max ? int8Max : value))
		}
		ref.view.setInt8(ref.byteOffset, value)
		byteLength = 1
	}
	else if (metaValue.type === Types.boolean) {
		ref.view.setInt8(ref.byteOffset, value === false ? 0 : 1)
		byteLength = 1
	}
	else if (metaValue.type === Types.uint16) {
		if (metaValue.preventOverflow || metaValue.infinity) {
			value = (value < 0 ? 0 : (value > uint16Max ? uint16Max : value))
		}
		ref.view.setUint16(ref.byteOffset, value)
		byteLength = 2
	}
	else if (metaValue.type === Types.int16) {
		if (metaValue.preventOverflow || metaValue.infinity) {
			value = (value < int16Min ? int16Min : (value > int16Max ? int16Max : value))
		}
		ref.view.setInt16(ref.byteOffset, value)
		byteLength = 2
	}
	else if (metaValue.type === Types.uint32) {
		if (metaValue.preventOverflow || metaValue.infinity) {
			value = (value < 0 ? 0 : (value > uint32Max ? uint32Max : value))
		}
		ref.view.setUint32(ref.byteOffset, value)
		byteLength = 4
	}
	else if (metaValue.type === Types.int32) {
		if (metaValue.preventOverflow || metaValue.infinity) {
			value = (value < int32Min ? int32Min : (value > int32Max ? int32Max : value))
		}
		ref.view.setInt32(ref.byteOffset, value)
		byteLength = 4
	}
	else if (metaValue.type === Types.float32) {
		ref.view.setFloat32(ref.byteOffset, value)
		byteLength = 4
	}
	else if (metaValue.type === Types.float64) {
		ref.view.setFloat64(ref.byteOffset, value)
		byteLength = 8
	}
	else {
		if (metaValue.type === Types.string8 || metaValue.type === Types.string16 || metaValue.type === Types.string) {
			if (value instanceof Uint8Array) {
				value.forEach((value, slot) => {
					ref.view.setUint8(slot + ref.byteOffset, value)
				})
			} else {
				console.error('Unknown metaValue.type', metaValue.type, value)
			}
		}
		else {
			console.error('Unknown metaValue.type', metaValue.type, value)
		}
		byteLength = value.byteLength
	}

	return byteLength
}

function getByteLength(metaValue: Readonly<IMetaValue>, value?: any): number {

	let byteLength = 0

	if (metaValue.type === Types.int8 || metaValue.type === Types.uint8 || metaValue.type === Types.boolean) {
		byteLength = 1
	}
	else if (metaValue.type === Types.int16 || metaValue.type === Types.uint16) {
		byteLength = 2
	}
	else if (metaValue.type === Types.int32 || metaValue.type === Types.uint32 || metaValue.type === Types.float32) {
		byteLength = 4
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
		byteLength = 8
	}

	return byteLength
}

type UnflattenOptions = {
	byteOffset: number
	view: DataView
}

function unflatten(buffer: ArrayBuffer, template: any, options: UnflattenOptions) {

	let result: any

	if (isMetaValue(template)) {
		result = getValueFromBuffer(buffer, template, options)
	}
	else if (isArrayTemplate(template)) {
		result = []
		const type = template[1]?.lengthType ?? Types.uint32
		const value = getValueFromBuffer(buffer, { type }, options)
		const itemCallback = template[1]?.unpackCallback ?? null
		for (let i = 0; i < (isNumber(value) ? value : 0); i++) {
			let item = unflatten(buffer, template[0], options)
			if (typeof itemCallback === 'function') {
				item = itemCallback(item)
				if (typeof item !== 'undefined' && item !== null) {
					result.push(item)
				}
			} else {
				result.push(item)
			}
		}
	}
	else {
		result = {}
		for (const key in template) {
			const templateValue = template[key]
			if (isMetaValue(templateValue)) {
				result[key] = getValueFromBuffer(buffer, templateValue, options)
			} else {
				result[key] = unflatten(buffer, templateValue, options)
			}
		}
	}

	return result
}

function getValueFromBuffer(buffer: ArrayBuffer, metaValue: IMetaValue, ref: UnflattenOptions) {

	let value
	let byteLength = 0

	if (metaValue.type === Types.uint8) {
		value = ref.view.getUint8(ref.byteOffset)
		if (metaValue.infinity && value === Limits.uint8Max) {
			value = Infinity
		}
		byteLength = 1
	} else if (metaValue.type === Types.int8) {
		value = ref.view.getInt8(ref.byteOffset)
		if (metaValue.infinity && !(value > Limits.int8Min && value < Limits.int8Max)) {
			value *= Infinity
		}
		byteLength = 1
	}
	else if (metaValue.type === Types.boolean) {
		value = ref.view.getInt8(ref.byteOffset) === 0 ? false : true
		byteLength = 1
	}
	else if (metaValue.type === Types.uint16) {
		value = ref.view.getUint16(ref.byteOffset)
		if (metaValue.infinity && value === Limits.uint16Max) {
			value = Infinity
		}
		byteLength = 2
	} else if (metaValue.type === Types.int16) {
		value = ref.view.getInt16(ref.byteOffset)
		if (metaValue.infinity && !(value > Limits.int16Min && value < Limits.int16Max)) {
			value *= Infinity
		}
		byteLength = 2
	}
	else if (metaValue.type === Types.uint32) {
		value = ref.view.getUint32(ref.byteOffset)
		if (metaValue.infinity && value === Limits.uint32Max) {
			value = Infinity
		}
		byteLength = 4
	} else if (metaValue.type === Types.int32) {
		value = ref.view.getInt32(ref.byteOffset)
		if (metaValue.infinity && !(value > Limits.int32Min && value < Limits.int32Max)) {
			value *= Infinity
		}
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

	if (metaValue.compress) {
		value = metaValue.compress.unpack(value as any)
	} else if (isNumber(metaValue.multiplier) && isNumber(value)) {
		value = value / metaValue.multiplier
	}

	ref.byteOffset += byteLength

	return value
}

interface CommonOptions {
	byteOffset?: number
}
interface PackOptions extends IError, CommonOptions {
	bufferSizeInBytes?: number
	cacheBufferByTemplate?: boolean
	sharedBuffer?: ArrayBuffer
}

const bufferCache: Map<any, ArrayBuffer> = new Map()
let dynamic = false

export const pack = <A extends Indexable, B extends Indexable = any>(object: A, template: B, options: PackOptions = {}) => {

	let buffer: ArrayBuffer
	if (typeof options.sharedBuffer !== 'undefined') {
		buffer = options.sharedBuffer
	} else {
		if (options.cacheBufferByTemplate) {
			let tmpBuffer = bufferCache.get(template)
			if (!tmpBuffer) {
				dynamic = false
				const size = options.bufferSizeInBytes ?? calculateBufferSize(object, template)
				if (dynamic) {
					throw Error('Dynamic data (array or string) can not be serialized with cacheBufferByTemplate option enabled.')
				}
				tmpBuffer = new ArrayBuffer(size)
				bufferCache.set(template, tmpBuffer)
			}
			buffer = tmpBuffer
		} else {
			const size = options.bufferSizeInBytes ?? calculateBufferSize(object, template)
			buffer = new ArrayBuffer(size)
		}
	}

	const ref: RefObject = {
		byteOffset: options.byteOffset ?? 0,
		view: new DataView(buffer),
		onErrorCallback: options.onErrorCallback,
	}
	flatten(object, template, ref)

	return buffer
}

export const unpack = <R = any>(buffer: ArrayBuffer, template: any, options: CommonOptions = {}): R => {
	const { byteOffset = 0 } = options
	return unflatten(buffer, template, { byteOffset, view: new DataView(buffer) })
}

type TDecodeText = (input: ArrayBuffer) => string
interface ITextDecoder {
	decode: (input: ArrayBuffer) => string
}
const MakeDecoderFn = (decoder: ITextDecoder) => (input: ArrayBuffer) => decoder.decode(input)
let decodeText: TDecodeText
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
const MakeEncoderFn = (encoder: ITextEncoder) => (input: string) => encoder.encode(input)
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