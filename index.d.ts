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
}
interface ArrayOptions {
    lengthType?: Types.uint8 | Types.uint16 | Types.uint32;
    unpackCallback?: (item: any) => any;
}
export declare type ArrayTemplate<T = any> = [T, ArrayOptions?];
export declare const calculateBufferSize: (data: any, template: any, size?: number) => number;
interface packExtraParams {
    sharedBuffer?: ArrayBuffer;
    returnCopy?: boolean;
    freeBytes?: number;
    bufferSizeInBytes?: number;
    onErrorCallback?: (error: string) => void;
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
