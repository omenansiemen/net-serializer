declare type MetaValueType = 'int8' | 'uint8' | 'int16' | 'uint16' | 'int32' | 'uint32' | 'float32' | 'boolean' | 'string';
export interface IMetaValue {
    type: MetaValueType;
    multiplier?: number;
    preventOverflow?: boolean;
    _value?: number | boolean | Uint8Array;
}
export declare const pack: (objects: any, template: any, header?: IMetaValue[]) => ArrayBuffer;
export declare const unpack: (buffer: ArrayBuffer, template: any) => any;
interface ITextHandler {
    encode: (input: string) => Uint8Array;
    decode: (input: ArrayBuffer) => string;
}
export declare const setTextHandler: (handler: ITextHandler) => void;
declare const NetSerializer: {
    pack: (objects: any, template: any, header?: IMetaValue[]) => ArrayBuffer;
    unpack: (buffer: ArrayBuffer, template: any) => any;
    setTextHandler: (handler: ITextHandler) => void;
};
export default NetSerializer;
