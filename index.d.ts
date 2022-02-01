declare const uint8Max = 255;
declare const int8Min = -128;
declare const int8Max = 127;
declare const uint16Max = 65535;
declare const int16Min = -32768;
declare const int16Max = 32767;
declare const uint32Max = 4294967295;
declare const int32Min = -2147483648;
declare const int32Max = 2147483647;
interface ILimits {
    uint8Max: typeof uint8Max;
    int8Min: typeof int8Min;
    int8Max: typeof int8Max;
    uint16Max: typeof uint16Max;
    int16Min: typeof int16Min;
    int16Max: typeof int16Max;
    uint32Max: typeof uint32Max;
    int32Min: typeof int32Min;
    int32Max: typeof int32Max;
}
export declare const Limits: ILimits;
export declare enum Types {
    int8 = "int8",
    uint8 = "uint8",
    int16 = "int16",
    uint16 = "uint16",
    int32 = "int32",
    uint32 = "uint32",
    float32 = "float32",
    float64 = "float64",
    boolean = "boolean",
    string8 = "string8",
    string16 = "string16",
    string = "string"
}
declare type metaValueType = 'int8' | 'uint8' | 'int16' | 'uint16' | 'int32' | 'uint32' | 'float32' | 'float64' | 'boolean' | 'string' | 'string8' | 'string16';
export interface IMetaValue {
    type: metaValueType;
    multiplier?: number;
    preventOverflow?: boolean;
    compress?: {
        /**
         * @param value			Value of object's property being serialized
         * @param objectStack	Original data being serialized is always first element
         *  					and then followed by elements of array being serialized
         */
        pack: (prop: Object, objectStack?: any) => number;
        unpack: (value: number) => Object;
    };
}
interface ArrayOptions {
    lengthType?: Types.uint8 | Types.uint16 | Types.uint32;
    /**
     * Set this to true if array template does not contain any array
     */
    pure?: boolean;
    unpackCallback?: (item: any) => any;
}
export declare type ArrayTemplate<T = any> = [T, ArrayOptions?];
interface IError {
    onErrorCallback?: (error: string, callStack?: Array<object>) => void;
}
export declare const calculateBufferSize: <A, B = any>(data: A, template: B, size?: number) => number;
interface CommonOptions {
    byteOffset?: number;
}
interface PackOptions extends IError, CommonOptions {
    sharedBuffer?: ArrayBuffer;
    bufferSizeInBytes?: number;
}
export declare const pack: <A, B = any>(object: A, template: B, options?: PackOptions) => ArrayBuffer;
export declare const unpack: <R = any>(buffer: ArrayBuffer, template: any, options?: CommonOptions) => R;
interface ITextHandler {
    encode: (input: string) => Uint8Array;
    decode: (input: ArrayBuffer) => string;
}
export declare const setTextHandler: (handler: ITextHandler) => void;
declare const NetSerializer: {
    pack: <A, B = any>(object: A, template: B, options?: PackOptions) => ArrayBuffer;
    unpack: <R = any>(buffer: ArrayBuffer, template: any, options?: CommonOptions) => R;
    utils: {
        setTextHandler: (handler: ITextHandler) => void;
        calculateBufferSize: <A_1, B_1 = any>(data: A_1, template: B_1, size?: number) => number;
        Types: typeof Types;
    };
};
export default NetSerializer;
