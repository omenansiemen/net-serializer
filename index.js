"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e,t=function(e){return"boolean"==typeof e},r=function(e){return null!==e&&"object"==typeof e},n=function(e){return function(e){return"object"==typeof e&&Array.isArray(e)}(e)&&(1===e.length||2===e.length)},s=function(e){return"number"==typeof e},i={uint8Max:255,int8Min:-128,int8Max:127,uint16Max:65535,int16Min:-32768,int16Max:32767,uint32Max:4294967295,int32Min:-2147483648,int32Max:2147483647};exports.Types=void 0,(e=exports.Types||(exports.Types={})).int8="int8",e.uint8="uint8",e.int16="int16",e.uint16="uint16",e.int32="int32",e.uint32="uint32",e.float32="float32",e.float64="float64",e.boolean="boolean",e.string8="string8",e.string16="string16",e.string="string";var p=function(e){return"string"==typeof e.type};function o(e,i,f){var a,u;if(n(i)){var v={type:null!==(u=null===(a=i[1])||void 0===a?void 0:a.lengthType)&&void 0!==u?u:exports.Types.uint32};if(f.byteOffset+=l(f,v,e.length),p(i[0]))for(var c=0,x=e;c<x.length;c++){var T=x[c];f.byteOffset+=l(f,i[0],T)}else for(var b=0,g=e;b<g.length;b++){o(T=g[b],i[0],f)}}else for(var d in i){var O=e[d],h=i[d];if(s(O)||t(O))f.byteOffset+=l(f,h,O);else if(r(O))p(h)&&h.compress?f.byteOffset+=l(f,h,O):o(O,h,f);else{if("string"!=typeof O){var m="";throw void 0===O&&(m="Template property ".concat(d,", is not found from data ").concat(e,".")),"function"==typeof f.onErrorCallback&&f.onErrorCallback(m),Error(m)}var k=w(O),B={type:y(h.type)};f.byteOffset+=l(f,B,k.byteLength),f.byteOffset+=l(f,h,k)}}}var f=function(e,i,o){var l,u,v;if(void 0===o&&(o=0),n(i)&&Array.isArray(e)){if(b=!0,o+=a({type:null!==(u=null===(l=i[1])||void 0===l?void 0:l.lengthType)&&void 0!==u?u:exports.Types.uint32},e.length),e.length>0)if(p(i[0]))o+=a(i[0])*e.length;else if(null===(v=i[1])||void 0===v?void 0:v.pure){var c=o,x=(o=f(e[0],i[0],o))-c;o+=(e.length-1)*x}else for(var T=0;T<e.length;T++)o=f(e[T],i[0],o)}else for(var g in i){var d=e[g],O=i[g];if(s(d)||t(d))o+=a(O);else if(r(d))p(O)&&O.compress?o+=a(O):o=f(d,O,o);else if("string"==typeof d){b=!0;var h=w(d);o+=a({type:y(O.type)},h.byteLength),o+=h.byteLength}}return o},y=function(e){return e===exports.Types.string8?exports.Types.uint8:e===exports.Types.string16?exports.Types.uint16:exports.Types.uint32};function l(e,t,r){var n=0;return t.compress?r=t.compress.pack(r):s(t.multiplier)&&s(r)&&(r*=t.multiplier),t.type===exports.Types.uint8?(t.preventOverflow&&(r=r<0?0:r>255?255:r),e.view.setUint8(e.byteOffset,r),n=1):t.type===exports.Types.int8?(t.preventOverflow&&(r=r<-128?-128:r>127?127:r),e.view.setInt8(e.byteOffset,r),n=1):t.type===exports.Types.boolean?(e.view.setInt8(e.byteOffset,!1===r?0:1),n=1):t.type===exports.Types.uint16?(t.preventOverflow&&(r=r<0?0:r>65535?65535:r),e.view.setUint16(e.byteOffset,r),n=2):t.type===exports.Types.int16?(t.preventOverflow&&(r=r<-32768?-32768:r>32767?32767:r),e.view.setInt16(e.byteOffset,r),n=2):t.type===exports.Types.uint32?(t.preventOverflow&&(r=r<0?0:r>4294967295?4294967295:r),e.view.setUint32(e.byteOffset,r),n=4):t.type===exports.Types.int32?(t.preventOverflow&&(r=r<-2147483648?-2147483648:r>2147483647?2147483647:r),e.view.setInt32(e.byteOffset,r),n=4):t.type===exports.Types.float32?(e.view.setFloat32(e.byteOffset,r),n=4):t.type===exports.Types.float64?(e.view.setFloat64(e.byteOffset,r),n=8):(t.type!==exports.Types.string8&&t.type!==exports.Types.string16&&t.type!==exports.Types.string||r instanceof Uint8Array&&r.forEach((function(t,r){e.view.setUint8(r+e.byteOffset,t)})),n=r.byteLength),n}function a(e,t){var r=0;return e.type===exports.Types.int8||e.type===exports.Types.uint8||e.type===exports.Types.boolean?r=1:e.type===exports.Types.int16||e.type===exports.Types.uint16?r=2:e.type===exports.Types.int32||e.type===exports.Types.uint32||e.type===exports.Types.float32?r=4:e.type===exports.Types.string8||e.type===exports.Types.string16||e.type===exports.Types.string?r=t instanceof Uint8Array?t.byteLength:e.type===exports.Types.string8?1:e.type===exports.Types.string16?2:4:e.type===exports.Types.float64&&(r=8),r}function u(e,t,r){var i,o,f,y,l;if(p(t))l=v(e,t,r);else if(n(t)){l=[];for(var a=v(e,{type:null!==(o=null===(i=t[1])||void 0===i?void 0:i.lengthType)&&void 0!==o?o:exports.Types.uint32},r),c=null!==(y=null===(f=t[1])||void 0===f?void 0:f.unpackCallback)&&void 0!==y?y:null,x=0;x<(s(a)?a:0);x++){var T=u(e,t[0],r);"function"==typeof c?null!=(T=c(T))&&l.push(T):l.push(T)}}else for(var b in l={},t){var g=t[b];p(g)?l[b]=v(e,g,r):l[b]=u(e,g,r)}return l}function v(e,t,r){var n,i=0;if(t.type===exports.Types.uint8)n=r.view.getUint8(r.byteOffset),i=1;else if(t.type===exports.Types.int8)n=r.view.getInt8(r.byteOffset),i=1;else if(t.type===exports.Types.boolean)n=0!==r.view.getInt8(r.byteOffset),i=1;else if(t.type===exports.Types.uint16)n=r.view.getUint16(r.byteOffset),i=2;else if(t.type===exports.Types.int16)n=r.view.getInt16(r.byteOffset),i=2;else if(t.type===exports.Types.uint32)n=r.view.getUint32(r.byteOffset),i=4;else if(t.type===exports.Types.int32)n=r.view.getInt32(r.byteOffset),i=4;else if(t.type===exports.Types.float32)n=r.view.getFloat32(r.byteOffset),i=4;else if(t.type===exports.Types.float64)n=r.view.getFloat64(r.byteOffset),i=8;else if(t.type===exports.Types.string8||t.type===exports.Types.string16||t.type===exports.Types.string){i=a(t);var p=void 0,o=void 0;t.type===exports.Types.string8?(i+=p=r.view.getUint8(r.byteOffset),o=r.byteOffset+1):t.type===exports.Types.string16?(i+=p=r.view.getUint16(r.byteOffset),o=r.byteOffset+2):(i+=p=r.view.getUint32(r.byteOffset),o=r.byteOffset+4);var f=o+p;n=c(e.slice(o,f))}return t.compress?n=t.compress.unpack(n):s(t.multiplier)&&s(n)&&(n/=t.multiplier),r.byteOffset+=i,n}var c,x,T=new Map,b=!1,g=function(e,t,r){var n,s,i,p;if(void 0===r&&(r={}),void 0!==r.sharedBuffer)p=r.sharedBuffer;else if(r.cacheBufferByTemplate){var y=T.get(t);if(!y){b=!1;var l=null!==(n=r.bufferSizeInBytes)&&void 0!==n?n:f(e,t);if(b)throw Error("Dynamic data (array or string) can not be serialized with cacheBufferByTemplate option enabled.");y=new ArrayBuffer(l),T.set(t,y)}p=y}else{l=null!==(s=r.bufferSizeInBytes)&&void 0!==s?s:f(e,t);p=new ArrayBuffer(l)}return o(e,t,{byteOffset:null!==(i=r.byteOffset)&&void 0!==i?i:0,view:new DataView(p),onErrorCallback:r.onErrorCallback}),p},d=function(e,t,r){void 0===r&&(r={});var n=r.byteOffset;return u(e,t,{byteOffset:void 0===n?0:n,view:new DataView(e)})},O=function(e){return function(t){return e.decode(t)}};"function"==typeof TextDecoder&&(x=new TextDecoder,c=O(x));var w,h,m=function(e){return function(t){return e.encode(t)}};"function"==typeof TextEncoder&&(h=new TextEncoder,w=m(h));var k=function(e){w=m(e),c=O(e)},B={pack:g,unpack:d,utils:{setTextHandler:k,calculateBufferSize:f,Types:exports.Types}};exports.Limits=i,exports.calculateBufferSize=f,exports.default=B,exports.pack=g,exports.setTextHandler=k,exports.unpack=d;
