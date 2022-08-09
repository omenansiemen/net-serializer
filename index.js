"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e,t=function(e){return"boolean"==typeof e},n=function(e){return null!==e&&"object"==typeof e},i=function(e){return function(e){return"object"==typeof e&&Array.isArray(e)}(e)&&(1===e.length||2===e.length)},r=function(e){return"number"==typeof e},s={uint8Max:255,int8Min:-128,int8Max:127,uint16Max:65535,int16Min:-32768,int16Max:32767,uint32Max:4294967295,int32Min:-2147483648,int32Max:2147483647};exports.Types=void 0,(e=exports.Types||(exports.Types={})).int8="int8",e.uint8="uint8",e.int16="int16",e.uint16="uint16",e.int32="int32",e.uint32="uint32",e.float32="float32",e.float64="float64",e.boolean="boolean",e.string8="string8",e.string16="string16",e.string="string";var p=function(e){return"string"==typeof e.type};function f(e,s,o){var l,u;if(i(s)){var v={type:null!==(u=null===(l=s[1])||void 0===l?void 0:l.lengthType)&&void 0!==u?u:exports.Types.uint32};if(o.byteOffset+=a(o,v,e.length),p(s[0]))for(var c=0,x=e;c<x.length;c++){var T=x[c];o.byteOffset+=a(o,s[0],T)}else for(var b=0,g=e;b<g.length;b++){f(T=g[b],s[0],o)}}else for(var O=0,d=Object.keys(s);O<d.length;O++){var h=d[O],M=e[h],m=s[h];if(n(M))p(m)&&m.compress?o.byteOffset+=a(o,m,M):f(M,m,o);else if(r(M)||t(M))o.byteOffset+=a(o,m,M);else{if("string"!=typeof M){var I="";throw void 0===M&&(I="Template property ".concat(h,", is not found from data ").concat(e,".")),"function"==typeof o.onErrorCallback&&o.onErrorCallback(I),Error(I)}var k=w(M),B={type:y(m.type)};o.byteOffset+=a(o,B,k.byteLength),o.byteOffset+=a(o,m,k)}}}var o=function(e,s,f){var a,u,v;if(void 0===f&&(f=0),i(s)&&Array.isArray(e)){b=!0;var c={type:null!==(u=null===(a=s[1])||void 0===a?void 0:a.lengthType)&&void 0!==u?u:exports.Types.uint32};if(f+=l(c,e.length),e.length>0)if(p(s[0])){var x=l(s[0]);f+=x*e.length}else if(null===(v=s[1])||void 0===v?void 0:v.pure){var T=f,g=(f=o(e[0],s[0],f))-T;f+=(e.length-1)*g}else for(var O=0;O<e.length;O++)f=o(e[O],s[0],f)}else Object.keys(s).forEach((function(i){var a=e[i],u=s[i];if(n(a))p(u)&&u.compress?f+=l(u):f=o(a,u,f);else if(r(a)||t(a))f+=l(u);else if("string"==typeof a){b=!0;var v=w(a),c=y(u.type);f+=l({type:c},v.byteLength),f+=v.byteLength}}));return f},y=function(e){return e===exports.Types.string8?exports.Types.uint8:e===exports.Types.string16?exports.Types.uint16:exports.Types.uint32};function a(e,t,n){var i=0;return t.compress?n=t.compress.pack(n):r(t.multiplier)&&r(n)&&(n*=t.multiplier),t.type===exports.Types.uint8?((t.preventOverflow||t.infinity)&&(n=n<0?0:n>255?255:n),e.view.setUint8(e.byteOffset,n),i=1):t.type===exports.Types.int8?((t.preventOverflow||t.infinity)&&(n=n<-128?-128:n>127?127:n),e.view.setInt8(e.byteOffset,n),i=1):t.type===exports.Types.boolean?(e.view.setInt8(e.byteOffset,!1===n?0:1),i=1):t.type===exports.Types.uint16?((t.preventOverflow||t.infinity)&&(n=n<0?0:n>65535?65535:n),e.view.setUint16(e.byteOffset,n),i=2):t.type===exports.Types.int16?((t.preventOverflow||t.infinity)&&(n=n<-32768?-32768:n>32767?32767:n),e.view.setInt16(e.byteOffset,n),i=2):t.type===exports.Types.uint32?((t.preventOverflow||t.infinity)&&(n=n<0?0:n>4294967295?4294967295:n),e.view.setUint32(e.byteOffset,n),i=4):t.type===exports.Types.int32?((t.preventOverflow||t.infinity)&&(n=n<-2147483648?-2147483648:n>2147483647?2147483647:n),e.view.setInt32(e.byteOffset,n),i=4):t.type===exports.Types.float32?(e.view.setFloat32(e.byteOffset,n),i=4):t.type===exports.Types.float64?(e.view.setFloat64(e.byteOffset,n),i=8):(t.type!==exports.Types.string8&&t.type!==exports.Types.string16&&t.type!==exports.Types.string||n instanceof Uint8Array&&n.forEach((function(t,n){e.view.setUint8(n+e.byteOffset,t)})),i=n.byteLength),i}function l(e,t){var n=0;return e.type===exports.Types.int8||e.type===exports.Types.uint8||e.type===exports.Types.boolean?n=1:e.type===exports.Types.int16||e.type===exports.Types.uint16?n=2:e.type===exports.Types.int32||e.type===exports.Types.uint32||e.type===exports.Types.float32?n=4:e.type===exports.Types.string8||e.type===exports.Types.string16||e.type===exports.Types.string?n=t instanceof Uint8Array?t.byteLength:e.type===exports.Types.string8?1:e.type===exports.Types.string16?2:4:e.type===exports.Types.float64&&(n=8),n}function u(e,t,n){var s,f,o,y,a;if(i(t)){a=[];for(var l=null!==(f=null===(s=t[1])||void 0===s?void 0:s.lengthType)&&void 0!==f?f:exports.Types.uint32,c=v(e,{type:l},n),x=null!==(y=null===(o=t[1])||void 0===o?void 0:o.unpackCallback)&&void 0!==y?y:null,T=0;T<(r(c)?c:0);T++){var b=u(e,t[0],n);x?null!=(b=x(b))&&a.push(b):a.push(b)}}else p(t)?a=v(e,t,n):(a={},Object.keys(t).forEach((function(i){var r=t[i];p(r)?a[i]=v(e,r,n):a[i]=u(e,r,n)})));return a}function v(e,t,n){var i,p=0;if(t.type===exports.Types.uint8)i=n.view.getUint8(n.byteOffset),t.infinity&&i===s.uint8Max&&(i=Infinity),p=1;else if(t.type===exports.Types.int8)i=n.view.getInt8(n.byteOffset),!t.infinity||i>s.int8Min&&i<s.int8Max||(i*=Infinity),p=1;else if(t.type===exports.Types.boolean)i=0!==n.view.getInt8(n.byteOffset),p=1;else if(t.type===exports.Types.uint16)i=n.view.getUint16(n.byteOffset),t.infinity&&i===s.uint16Max&&(i=Infinity),p=2;else if(t.type===exports.Types.int16)i=n.view.getInt16(n.byteOffset),!t.infinity||i>s.int16Min&&i<s.int16Max||(i*=Infinity),p=2;else if(t.type===exports.Types.uint32)i=n.view.getUint32(n.byteOffset),t.infinity&&i===s.uint32Max&&(i=Infinity),p=4;else if(t.type===exports.Types.int32)i=n.view.getInt32(n.byteOffset),!t.infinity||i>s.int32Min&&i<s.int32Max||(i*=Infinity),p=4;else if(t.type===exports.Types.float32)i=n.view.getFloat32(n.byteOffset),p=4;else if(t.type===exports.Types.float64)i=n.view.getFloat64(n.byteOffset),p=8;else if(t.type===exports.Types.string8||t.type===exports.Types.string16||t.type===exports.Types.string){p=l(t);var f=void 0,o=void 0;t.type===exports.Types.string8?(p+=f=n.view.getUint8(n.byteOffset),o=n.byteOffset+1):t.type===exports.Types.string16?(p+=f=n.view.getUint16(n.byteOffset),o=n.byteOffset+2):(p+=f=n.view.getUint32(n.byteOffset),o=n.byteOffset+4);var y=o+f;i=c(e.slice(o,y))}return t.compress?i=t.compress.unpack(i):r(t.multiplier)&&r(i)&&(i/=t.multiplier),n.byteOffset+=p,i}var c,x,T=new Map,b=!1,g=function(e,t,n){var i,r,s,p;if(void 0===n&&(n={}),void 0!==n.sharedBuffer)p=n.sharedBuffer;else if(n.cacheBufferByTemplate){var y=T.get(t);if(!y){b=!1;var a=null!==(i=n.bufferSizeInBytes)&&void 0!==i?i:o(e,t);if(b)throw Error("Dynamic data (array or string) can not be serialized with cacheBufferByTemplate option enabled.");y=new ArrayBuffer(a),T.set(t,y)}p=y}else{a=null!==(r=n.bufferSizeInBytes)&&void 0!==r?r:o(e,t);p=new ArrayBuffer(a)}return f(e,t,{byteOffset:null!==(s=n.byteOffset)&&void 0!==s?s:0,view:new DataView(p),onErrorCallback:n.onErrorCallback}),p},O=function(e,t,n){void 0===n&&(n={});var i=n.byteOffset;return u(e,t,{byteOffset:void 0===i?0:i,view:new DataView(e)})},d=function(e){return function(t){return e.decode(t)}};"function"==typeof TextDecoder&&(x=new TextDecoder,c=d(x));var w,h,M=function(e){return function(t){return e.encode(t)}};"function"==typeof TextEncoder&&(h=new TextEncoder,w=M(h));var m=function(e){w=M(e),c=d(e)},I={pack:g,unpack:O,utils:{setTextHandler:m,calculateBufferSize:o,Types:exports.Types}};exports.Limits=s,exports.calculateBufferSize=o,exports.default=I,exports.pack=g,exports.setTextHandler=m,exports.unpack=O;
