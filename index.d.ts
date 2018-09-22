declare type MetaValueType = 'int8' | 'uint8' | 'int16' | 'uint16' | 'int32' | 'uint32' | 'float32' | 'boolean' | 'string';
export interface IMetaValue {
    _type: MetaValueType;
    _multiplier?: number;
    _value?: number | boolean | Uint8Array;
    _preventOverflow?: boolean;
}
export declare const compress: (objects: any, template: any, header?: IMetaValue[]) => ArrayBuffer;
export declare const uncompress: (buffer: ArrayBuffer, template: any) => any;
interface ITextHandler {
    encode: (input: string) => Uint8Array;
    decode: (input: ArrayBuffer) => string;
}
export declare const setTextHandler: (handler: ITextHandler) => void;
declare const TypedSerializer: {
    compress: (objects: any, template: any, header?: IMetaValue[]) => ArrayBuffer;
    uncompress: (buffer: ArrayBuffer, template: any) => any;
    setTextHandler: (handler: ITextHandler) => void;
};
export default TypedSerializer;
