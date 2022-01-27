"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.setTextHandler=exports.unpack=exports.pack=exports.calculateBufferSize=exports.Types=exports.Limits=void 0;var e,t=function(e){return"boolean"==typeof e},n=function(e){return null!==e&&"object"==typeof e},i=function(e){return function(e){return"object"==typeof e&&Array.isArray(e)}(e)&&(1===e.length||2===e.length)},r=function(e){return"number"==typeof e};exports.Limits={uint8Max:255,int8Min:-128,int8Max:127,uint16Max:65535,int16Min:-32768,int16Max:32767,uint32Max:4294967295,int32Min:-2147483648,int32Max:2147483647},function(e){e.int8="int8",e.uint8="uint8",e.int16="int16",e.uint16="uint16",e.int32="int32",e.uint32="uint32",e.float32="float32",e.float64="float64",e.boolean="boolean",e.string8="string8",e.string16="string16",e.string="string"}(e=exports.Types||(exports.Types={}));var f=function(e){return"string"==typeof e.type};function o(a,p,u){var y,c;if(u.callStack.push(a),i(p)){var v={type:null!==(c=null===(y=p[1])||void 0===y?void 0:y.lengthType)&&void 0!==c?c:e.uint32};if(u.byteOffset+=l(u,v,a.length),f(p[0]))for(var g=0,O=a;g<O.length;g++){var d=O[g];u.byteOffset+=l(u,p[0],d)}else for(var w=0,x=a;w<x.length;w++){o(d=x[w],p[0],u)}}else for(var h=0,k=Object.keys(p);h<k.length;h++){var m=k[h],T=a[m],S=p[m];if(n(T))f(S)&&S.compress?u.byteOffset+=l(u,S,S.compress.pack(T,u.callStack)):o(T,S,u);else if(r(T)||t(T))f(S)&&S.compress?u.byteOffset+=l(u,S,S.compress.pack(T,u.callStack)):u.byteOffset+=l(u,S,T);else{if("string"!=typeof T){var B="";throw void 0===T&&(B="Template property "+m+", is not found from data "+a+"."),"function"==typeof u.onErrorCallback&&u.onErrorCallback(B,u.callStack),Error(B)}var U=b(T),E={type:s(S.type)};u.byteOffset+=l(u,E,U.byteLength),u.byteOffset+=l(u,S,U)}}u.callStack.pop()}exports.calculateBufferSize=function(o,l,p){var u,y,c;if(void 0===p&&(p=0),i(l)){var v={type:null!==(y=null===(u=l[1])||void 0===u?void 0:u.lengthType)&&void 0!==y?y:e.uint32};if(p+=a(v,o.length),o.length>0)if(f(l[0])){var g=a(l[0]);p+=g*o.length}else if(null===(c=l[1])||void 0===c?void 0:c.pure){var O=p,d=(p=exports.calculateBufferSize(o[0],l[0],p))-O;p+=(o.length-1)*d}else for(var w=0;w<o.length;w++)p=exports.calculateBufferSize(o[w],l[0],p)}else Object.keys(l).forEach((function(e){var i=o[e],u=l[e];if(n(i))f(u)&&u.compress?p+=a(u):p=exports.calculateBufferSize(i,u,p);else if(r(i)||t(i))p+=a(u);else if("string"==typeof i){var y=b(i),c=s(u.type);p+=a({type:c},y.byteLength),p+=y.byteLength}}));return p};var s=function(t){return t===e.string8?e.uint8:t===e.string16?e.uint16:e.uint32};function l(t,n,i){var f=0;return r(n.multiplier)&&r(i)&&(i*=n.multiplier),n.type===e.uint8?(n.preventOverflow&&(i=i<0?0:i>255?255:i),t.view.setUint8(t.byteOffset,i),f=1):n.type===e.int8?(n.preventOverflow&&(i=i<-128?-128:i>127?127:i),t.view.setInt8(t.byteOffset,i),f=1):n.type===e.boolean?(t.view.setInt8(t.byteOffset,!1===i?0:1),f=1):n.type===e.uint16?(n.preventOverflow&&(i=i<0?0:i>65535?65535:i),t.view.setUint16(t.byteOffset,i),f=2):n.type===e.int16?(n.preventOverflow&&(i=i<-32768?-32768:i>32767?32767:i),t.view.setInt16(t.byteOffset,i),f=2):n.type===e.uint32?(n.preventOverflow&&(i=i<0?0:i>4294967295?4294967295:i),t.view.setUint32(t.byteOffset,i),f=4):n.type===e.int32?(n.preventOverflow&&(i=i<-2147483648?-2147483648:i>2147483647?2147483647:i),t.view.setInt32(t.byteOffset,i),f=4):n.type===e.float32?(t.view.setFloat32(t.byteOffset,i),f=4):n.type===e.float64?(t.view.setFloat64(t.byteOffset,i),f=8):(n.type!==e.string8&&n.type!==e.string16&&n.type!==e.string||i instanceof Uint8Array&&i.forEach((function(e,n){t.view.setUint8(n+t.byteOffset,e)})),f=i.byteLength),f}function a(t,n){var i=0;return t.type===e.int8||t.type===e.uint8||t.type===e.boolean?i=1:t.type===e.int16||t.type===e.uint16?i=2:t.type===e.int32||t.type===e.uint32||t.type===e.float32?i=4:t.type===e.string8||t.type===e.string16||t.type===e.string?i=n instanceof Uint8Array?n.byteLength:t.type===e.string8?1:t.type===e.string16?2:4:t.type===e.float64&&(i=8),i}function p(t,n,o){var s,l,a,y,c;if(i(n)){c=[];for(var v=u(t,{type:null!==(l=null===(s=n[1])||void 0===s?void 0:s.lengthType)&&void 0!==l?l:e.uint32},o),b=null!==(y=null===(a=n[1])||void 0===a?void 0:a.unpackCallback)&&void 0!==y?y:null,g=0;g<(r(v)?v:0);g++){var O=p(t,n[0],o);b?null!=(O=b(O))&&c.push(O):c.push(O)}}else f(n)?c=u(t,n,o):(c={},Object.keys(n).forEach((function(e){var i=n[e];if(f(i))if(i.compress){var r=u(t,i,o);c[e]=i.compress.unpack(r)}else c[e]=u(t,i,o);else c[e]=p(t,i,o)})));return c}function u(t,n,i){var f,o=0;if(n.type===e.uint8)f=i.view.getUint8(i.byteOffset),o=1;else if(n.type===e.int8)f=i.view.getInt8(i.byteOffset),o=1;else if(n.type===e.boolean)f=0!==i.view.getInt8(i.byteOffset),o=1;else if(n.type===e.uint16)f=i.view.getUint16(i.byteOffset),o=2;else if(n.type===e.int16)f=i.view.getInt16(i.byteOffset),o=2;else if(n.type===e.uint32)f=i.view.getUint32(i.byteOffset),o=4;else if(n.type===e.int32)f=i.view.getInt32(i.byteOffset),o=4;else if(n.type===e.float32)f=i.view.getFloat32(i.byteOffset),o=4;else if(n.type===e.float64)f=i.view.getFloat64(i.byteOffset),o=8;else if(n.type===e.string8||n.type===e.string16||n.type===e.string){o=a(n);var s=void 0,l=void 0;n.type===e.string8?(o+=s=i.view.getUint8(i.byteOffset),l=i.byteOffset+1):n.type===e.string16?(o+=s=i.view.getUint16(i.byteOffset),l=i.byteOffset+2):(o+=s=i.view.getUint32(i.byteOffset),l=i.byteOffset+4);var p=l+s;f=y(t.slice(l,p))}return r(n.multiplier)&&r(f)&&(f/=n.multiplier),i.byteOffset+=o,f}exports.pack=function(e,t,n){void 0===n&&(n={});var i,r=n.sharedBuffer,f=n.returnCopy,s=void 0!==f&&f,l=n.freeBytes,a=void 0===l?0:l,p=n.bufferSizeInBytes,u=null!=p?p:exports.calculateBufferSize(e,t);return o(e,t,{buffer:i=void 0!==r?r:new ArrayBuffer(u+a),byteOffset:0,callStack:[],view:new DataView(i),onErrorCallback:n.onErrorCallback}),void 0!==r&&s?i.slice(0,u):i},exports.unpack=function(e,t){return p(e,t,{byteOffset:0,view:new DataView(e)})};var y,c,v=function(e){return function(t){return e.decode(t)}};"function"==typeof TextDecoder&&(c=new TextDecoder,y=v(c));var b,g,O=function(e){return function(t){return e.encode(t)}};"function"==typeof TextEncoder&&(g=new TextEncoder,b=O(g)),exports.setTextHandler=function(e){b=O(e),y=v(e)};var d={pack:exports.pack,unpack:exports.unpack,utils:{setTextHandler:exports.setTextHandler,calculateBufferSize:exports.calculateBufferSize,Types:e}};exports.default=d;
