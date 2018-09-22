export const isDefined = (val: any) => typeof val !== 'undefined';
export const isUndefined = (val: any): val is undefined => typeof val === 'undefined';
export const isBoolean = (val: any): val is boolean => typeof val === 'boolean';
export const isObject = (val: any): val is object => typeof val === 'object';
export const isArray = (val: any): val is Array<any> => typeof val === 'object' && Array.isArray(val);
export const isNumber = (val: any): val is number =>
	(typeof val === 'number' && isFinite(val)) || (val !== '' && isFinite(Number(val)))
export const isString = (val: any): val is string => typeof val === 'string';