"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDefined = (val) => typeof val !== 'undefined';
exports.isUndefined = (val) => typeof val === 'undefined';
exports.isBoolean = (val) => typeof val === 'boolean';
exports.isObject = (val) => typeof val === 'object';
exports.isArray = (val) => typeof val === 'object' && Array.isArray(val);
exports.isNumber = (val) => (typeof val === 'number' && isFinite(val)) || (val !== '' && isFinite(Number(val)));
exports.isString = (val) => typeof val === 'string';
