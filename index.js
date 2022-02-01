"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.setTextHandler=exports.unpack=exports.pack=exports.calculateBufferSize=exports.Types=exports.Limits=void 0;var e,t=function(e){return"boolean"==typeof e},n=function(e){return null!==e&&"object"==typeof e},i=function(e){return function(e){return"object"==typeof e&&Array.isArray(e)}(e)&&(1===e.length||2===e.length)},r=function(e){return"number"==typeof e};exports.Limits={uint8Max:255,int8Min:-128,int8Max:127,uint16Max:65535,int16Min:-32768,int16Max:32767,uint32Max:4294967295,int32Min:-2147483648,int32Max:2147483647},function(e){e.int8="int8",e.uint8="uint8",e.int16="int16",e.uint16="uint16",e.int32="int32",e.uint32="uint32",e.float32="float32",e.float64="float64",e.boolean="boolean",e.string8="string8",e.string16="string16",e.string="string"}(e=exports.Types||(exports.Types={}));var f=function(e){return"string"==typeof e.type};function o(a,u,p){var y,c;if(i(u)){var v={type:null!==(c=null===(y=u[1])||void 0===y?void 0:y.lengthType)&&void 0!==c?c:e.uint32};if(p.byteOffset+=l(p,v,a.length),f(u[0]))for(var b=0,O=a;b<O.length;b++){var d=O[b];p.byteOffset+=l(p,u[0],d)}else for(var w=0,x=a;w<x.length;w++){d=x[w];p.objectStack.push(d),o(d,u[0],p),p.objectStack.pop()}}else for(var h=0,k=Object.keys(u);h<k.length;h++){var m=k[h],B=a[m],S=u[m];if(n(B))f(S)&&S.compress?p.byteOffset+=l(p,S,S.compress.pack(B,p.objectStack)):o(B,S,p);else if(r(B)||t(B))f(S)&&S.compress?p.byteOffset+=l(p,S,S.compress.pack(B,p.objectStack)):p.byteOffset+=l(p,S,B);else{if("string"!=typeof B){var T="";throw void 0===B&&(T="Template property "+m+", is not found from data "+a+"."),"function"==typeof p.onErrorCallback&&p.onErrorCallback(T),Error(T)}var U=g(B),j={type:s(S.type)};p.byteOffset+=l(p,j,U.byteLength),p.byteOffset+=l(p,S,U)}}}exports.calculateBufferSize=function(o,l,u){var p,y,c;if(void 0===u&&(u=0),i(l)&&Array.isArray(o)){var v={type:null!==(y=null===(p=l[1])||void 0===p?void 0:p.lengthType)&&void 0!==y?y:e.uint32};if(u+=a(v,o.length),o.length>0)if(f(l[0])){var b=a(l[0]);u+=b*o.length}else if(null===(c=l[1])||void 0===c?void 0:c.pure){var O=u,d=(u=exports.calculateBufferSize(o[0],l[0],u))-O;u+=(o.length-1)*d}else for(var w=0;w<o.length;w++)u=exports.calculateBufferSize(o[w],l[0],u)}else Object.keys(l).forEach((function(e){var i=o[e],p=l[e];if(n(i))f(p)&&p.compress?u+=a(p):u=exports.calculateBufferSize(i,p,u);else if(r(i)||t(i))u+=a(p);else if("string"==typeof i){var y=g(i),c=s(p.type);u+=a({type:c},y.byteLength),u+=y.byteLength}}));return u};var s=function(t){return t===e.string8?e.uint8:t===e.string16?e.uint16:e.uint32};function l(t,n,i){var f=0;return r(n.multiplier)&&r(i)&&(i*=n.multiplier),n.type===e.uint8?(n.preventOverflow&&(i=i<0?0:i>255?255:i),t.view.setUint8(t.byteOffset,i),f=1):n.type===e.int8?(n.preventOverflow&&(i=i<-128?-128:i>127?127:i),t.view.setInt8(t.byteOffset,i),f=1):n.type===e.boolean?(t.view.setInt8(t.byteOffset,!1===i?0:1),f=1):n.type===e.uint16?(n.preventOverflow&&(i=i<0?0:i>65535?65535:i),t.view.setUint16(t.byteOffset,i),f=2):n.type===e.int16?(n.preventOverflow&&(i=i<-32768?-32768:i>32767?32767:i),t.view.setInt16(t.byteOffset,i),f=2):n.type===e.uint32?(n.preventOverflow&&(i=i<0?0:i>4294967295?4294967295:i),t.view.setUint32(t.byteOffset,i),f=4):n.type===e.int32?(n.preventOverflow&&(i=i<-2147483648?-2147483648:i>2147483647?2147483647:i),t.view.setInt32(t.byteOffset,i),f=4):n.type===e.float32?(t.view.setFloat32(t.byteOffset,i),f=4):n.type===e.float64?(t.view.setFloat64(t.byteOffset,i),f=8):(n.type!==e.string8&&n.type!==e.string16&&n.type!==e.string||i instanceof Uint8Array&&i.forEach((function(e,n){t.view.setUint8(n+t.byteOffset,e)})),f=i.byteLength),f}function a(t,n){var i=0;return t.type===e.int8||t.type===e.uint8||t.type===e.boolean?i=1:t.type===e.int16||t.type===e.uint16?i=2:t.type===e.int32||t.type===e.uint32||t.type===e.float32?i=4:t.type===e.string8||t.type===e.string16||t.type===e.string?i=n instanceof Uint8Array?n.byteLength:t.type===e.string8?1:t.type===e.string16?2:4:t.type===e.float64&&(i=8),i}function u(t,n,o){var s,l,a,y,c;if(i(n)){c=[];for(var v=p(t,{type:null!==(l=null===(s=n[1])||void 0===s?void 0:s.lengthType)&&void 0!==l?l:e.uint32},o),b=null!==(y=null===(a=n[1])||void 0===a?void 0:a.unpackCallback)&&void 0!==y?y:null,g=0;g<(r(v)?v:0);g++){var O=u(t,n[0],o);b?null!=(O=b(O))&&c.push(O):c.push(O)}}else f(n)?c=p(t,n,o):(c={},Object.keys(n).forEach((function(e){var i=n[e];if(f(i))if(i.compress){var r=p(t,i,o);c[e]=i.compress.unpack(r)}else c[e]=p(t,i,o);else c[e]=u(t,i,o)})));return c}function p(t,n,i){var f,o=0;if(n.type===e.uint8)f=i.view.getUint8(i.byteOffset),o=1;else if(n.type===e.int8)f=i.view.getInt8(i.byteOffset),o=1;else if(n.type===e.boolean)f=0!==i.view.getInt8(i.byteOffset),o=1;else if(n.type===e.uint16)f=i.view.getUint16(i.byteOffset),o=2;else if(n.type===e.int16)f=i.view.getInt16(i.byteOffset),o=2;else if(n.type===e.uint32)f=i.view.getUint32(i.byteOffset),o=4;else if(n.type===e.int32)f=i.view.getInt32(i.byteOffset),o=4;else if(n.type===e.float32)f=i.view.getFloat32(i.byteOffset),o=4;else if(n.type===e.float64)f=i.view.getFloat64(i.byteOffset),o=8;else if(n.type===e.string8||n.type===e.string16||n.type===e.string){o=a(n);var s=void 0,l=void 0;n.type===e.string8?(o+=s=i.view.getUint8(i.byteOffset),l=i.byteOffset+1):n.type===e.string16?(o+=s=i.view.getUint16(i.byteOffset),l=i.byteOffset+2):(o+=s=i.view.getUint32(i.byteOffset),l=i.byteOffset+4);var u=l+s;f=c(t.slice(l,u))}return r(n.multiplier)&&r(f)&&(f/=n.multiplier),i.byteOffset+=o,f}var y=new Map;exports.pack=function(e,t,n){var i,r,f,s;if(void 0===n&&(n={}),void 0!==n.sharedBuffer)s=n.sharedBuffer;else if(n.cacheBuffer){var l=y.get(t);if(!l){var a=null!==(i=n.bufferSizeInBytes)&&void 0!==i?i:exports.calculateBufferSize(e,t);l=new ArrayBuffer(a),y.set(t,l)}s=l}else{a=null!==(r=n.bufferSizeInBytes)&&void 0!==r?r:exports.calculateBufferSize(e,t);s=new ArrayBuffer(a)}return o(e,t,{objectStack:[e],byteOffset:null!==(f=n.byteOffset)&&void 0!==f?f:0,view:new DataView(s),onErrorCallback:n.onErrorCallback}),s},exports.unpack=function(e,t,n){void 0===n&&(n={});var i=n.byteOffset;return u(e,t,{byteOffset:void 0===i?0:i,view:new DataView(e)})};var c,v,b=function(e){return function(t){return e.decode(t)}};"function"==typeof TextDecoder&&(v=new TextDecoder,c=b(v));var g,O,d=function(e){return function(t){return e.encode(t)}};"function"==typeof TextEncoder&&(O=new TextEncoder,g=d(O)),exports.setTextHandler=function(e){g=d(e),c=b(e)};var w={pack:exports.pack,unpack:exports.unpack,utils:{setTextHandler:exports.setTextHandler,calculateBufferSize:exports.calculateBufferSize,Types:e}};exports.default=w;
