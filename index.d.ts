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
        pack: (prop: Object, callStack?: Array<any>) => number;
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
export declare const calculateBufferSize: (data: any, template: any, size?: number) => number;
interface packExtraParams extends IError {
    sharedBuffer?: ArrayBuffer;
    returnCopy?: boolean;
    freeBytes?: number;
    bufferSizeInBytes?: number;
}
export declare const pack: (object: any, template: any, extra?: packExtraParams) => ArrayBuffer;
export declare const unpack: (buffer: ArrayBuffer, template: any) => any;
interface ITextHandler {
    encode: (input: string) => Uint8Array;
    decode: (input: ArrayBuffer) => string;
}
export declare const setTextHandler: (handler: ITextHandler) => void;
declare const NetSerializer: {
    pack: (object: any, template: any, extra?: packExtraParams) => ArrayBuffer;
    unpack: (buffer: ArrayBuffer, template: any) => any;
    utils: {
        setTextHandler: (handler: ITextHandler) => void;
        calculateBufferSize: (data: any, template: any, size?: number) => number;
        Types: typeof Types;
    };
};
export default NetSerializer;
