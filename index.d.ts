declare type MetaValueType = 'int8' | 'uint8' | 'int16' | 'uint16' | 'int32' | 'uint32' | 'float32' | 'float64' | 'boolean' | 'string' | 'string16' | 'string8';
export declare enum Type {
    i8 = "int8",
    u8 = "uint8",
    i16 = "int16",
    u16 = "uint16",
    i32 = "int32",
    u32 = "uint32",
    f32 = "float32",
    f64 = "float64",
    bool = "boolean",
    str8 = "string8",
    str16 = "string16",
    str32 = "string"
}
export interface IMetaValue {
    type: MetaValueType;
    multiplier?: number;
    preventOverflow?: boolean;
    allowOverflow?: boolean;
}
interface packExtraParams {
    sharedBuffer?: ArrayBuffer;
    returnCopy?: boolean;
}
export declare const pack: (objects: any, template: any, extra?: packExtraParams) => ArrayBuffer;
export declare const unpack: (buffer: ArrayBuffer, template: any) => any;
interface ITextHandler {
    encode: (input: string) => Uint8Array;
    decode: (input: ArrayBuffer) => string;
}
export declare const setTextHandler: (handler: ITextHandler) => void;
declare const NetSerializer: {
    pack: (objects: any, template: any, extra?: packExtraParams) => ArrayBuffer;
    unpack: (buffer: ArrayBuffer, template: any) => any;
    setTextHandler: (handler: ITextHandler) => void;
};
export default NetSerializer;
