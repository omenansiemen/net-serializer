Object.defineProperty(exports,"__esModule",{value:!0}),exports.setTextHandler=exports.unpack=exports.pack=exports.calculateBufferSize=exports.Types=exports.Limits=void 0;var t,e=function(t){return"boolean"==typeof t},i=function(t){return null!==t&&"object"==typeof t},n=function(t){return function(t){return"object"==typeof t&&Array.isArray(t)}(t)&&(1===t.length||2===t.length)},r=function(t){return"number"==typeof t};exports.Limits={uint8Max:255,int8Min:-128,int8Max:127,uint16Max:65535,int16Min:-32768,int16Max:32767,uint32Max:4294967295,int32Min:-2147483648,int32Max:2147483647},function(t){t.int8="int8",t.uint8="uint8",t.int16="int16",t.uint16="uint16",t.int32="int32",t.uint32="uint32",t.float32="float32",t.float64="float64",t.boolean="boolean",t.string8="string8",t.string16="string16",t.string="string"}(t=exports.Types||(exports.Types={}));var f=function(t){return"string"==typeof t.type};function s(y,l,p){var u,v;if(n(l)){var c={type:null!==(v=null===(u=l[1])||void 0===u?void 0:u.lengthType)&&void 0!==v?v:t.uint32};if(p.byteOffset+=a(p,c,y.length),f(l[0]))for(var b=0,g=y;b<g.length;b++){var d=g[b];p.byteOffset+=a(p,l[0],d)}else for(var O=0,w=y;O<w.length;O++){s(d=w[O],l[0],p)}}else for(var h=0,m=Object.keys(l);h<m.length;h++){var M=m[h],k=y[M],B=l[M];if(i(k))f(B)&&B.compress?p.byteOffset+=a(p,B,k):s(k,B,p);else if(r(k)||e(k))p.byteOffset+=a(p,B,k);else{if("string"!=typeof k){var T="";throw void 0===k&&(T="Template property "+M+", is not found from data "+y+"."),"function"==typeof p.onErrorCallback&&p.onErrorCallback(T),Error(T)}var I=x(k),L={type:o(B.type)};p.byteOffset+=a(p,L,I.byteLength),p.byteOffset+=a(p,B,I)}}}exports.calculateBufferSize=function(s,a,l){var p,u,c;if(void 0===l&&(l=0),n(a)&&Array.isArray(s)){v=!0;var b={type:null!==(u=null===(p=a[1])||void 0===p?void 0:p.lengthType)&&void 0!==u?u:t.uint32};if(l+=y(b,s.length),s.length>0)if(f(a[0])){var g=y(a[0]);l+=g*s.length}else if(null===(c=a[1])||void 0===c?void 0:c.pure){var d=l,O=(l=exports.calculateBufferSize(s[0],a[0],l))-d;l+=(s.length-1)*O}else for(var w=0;w<s.length;w++)l=exports.calculateBufferSize(s[w],a[0],l)}else Object.keys(a).forEach((function(t){var n=s[t],p=a[t];if(i(n))f(p)&&p.compress?l+=y(p):l=exports.calculateBufferSize(n,p,l);else if(r(n)||e(n))l+=y(p);else if("string"==typeof n){v=!0;var u=x(n),c=o(p.type);l+=y({type:c},u.byteLength),l+=u.byteLength}}));return l};var o=function(e){return e===t.string8?t.uint8:e===t.string16?t.uint16:t.uint32};function a(e,i,n){var f=0;return i.compress?n=i.compress.pack(n):r(i.multiplier)&&r(n)&&(n*=i.multiplier),i.type===t.uint8?((i.preventOverflow||i.infinity)&&(n=n<0?0:n>255?255:n),e.view.setUint8(e.byteOffset,n),f=1):i.type===t.int8?((i.preventOverflow||i.infinity)&&(n=n<-128?-128:n>127?127:n),e.view.setInt8(e.byteOffset,n),f=1):i.type===t.boolean?(e.view.setInt8(e.byteOffset,!1===n?0:1),f=1):i.type===t.uint16?((i.preventOverflow||i.infinity)&&(n=n<0?0:n>65535?65535:n),e.view.setUint16(e.byteOffset,n),f=2):i.type===t.int16?((i.preventOverflow||i.infinity)&&(n=n<-32768?-32768:n>32767?32767:n),e.view.setInt16(e.byteOffset,n),f=2):i.type===t.uint32?((i.preventOverflow||i.infinity)&&(n=n<0?0:n>4294967295?4294967295:n),e.view.setUint32(e.byteOffset,n),f=4):i.type===t.int32?((i.preventOverflow||i.infinity)&&(n=n<-2147483648?-2147483648:n>2147483647?2147483647:n),e.view.setInt32(e.byteOffset,n),f=4):i.type===t.float32?(e.view.setFloat32(e.byteOffset,n),f=4):i.type===t.float64?(e.view.setFloat64(e.byteOffset,n),f=8):(i.type!==t.string8&&i.type!==t.string16&&i.type!==t.string||n instanceof Uint8Array&&n.forEach((function(t,i){e.view.setUint8(i+e.byteOffset,t)})),f=n.byteLength),f}function y(e,i){var n=0;return e.type===t.int8||e.type===t.uint8||e.type===t.boolean?n=1:e.type===t.int16||e.type===t.uint16?n=2:e.type===t.int32||e.type===t.uint32||e.type===t.float32?n=4:e.type===t.string8||e.type===t.string16||e.type===t.string?n=i instanceof Uint8Array?i.byteLength:e.type===t.string8?1:e.type===t.string16?2:4:e.type===t.float64&&(n=8),n}function l(e,i,s){var o,a,y,u,v;if(n(i)){v=[];for(var c=null!==(a=null===(o=i[1])||void 0===o?void 0:o.lengthType)&&void 0!==a?a:t.uint32,b=p(e,{type:c},s),g=null!==(u=null===(y=i[1])||void 0===y?void 0:y.unpackCallback)&&void 0!==u?u:null,x=0;x<(r(b)?b:0);x++){var d=l(e,i[0],s);g?null!=(d=g(d))&&v.push(d):v.push(d)}}else f(i)?v=p(e,i,s):(v={},Object.keys(i).forEach((function(t){var n=i[t];f(n)?v[t]=p(e,n,s):v[t]=l(e,n,s)})));return v}function p(e,i,n){var f,s=0;if(i.type===t.uint8)f=n.view.getUint8(n.byteOffset),i.infinity&&f===exports.Limits.uint8Max&&(f=Infinity),s=1;else if(i.type===t.int8)f=n.view.getInt8(n.byteOffset),!i.infinity||f>exports.Limits.int8Min&&f<exports.Limits.int8Max||(f*=Infinity),s=1;else if(i.type===t.boolean)f=0!==n.view.getInt8(n.byteOffset),s=1;else if(i.type===t.uint16)f=n.view.getUint16(n.byteOffset),i.infinity&&f===exports.Limits.uint16Max&&(f=Infinity),s=2;else if(i.type===t.int16)f=n.view.getInt16(n.byteOffset),!i.infinity||f>exports.Limits.int16Min&&f<exports.Limits.int16Max||(f*=Infinity),s=2;else if(i.type===t.uint32)f=n.view.getUint32(n.byteOffset),i.infinity&&f===exports.Limits.uint32Max&&(f=Infinity),s=4;else if(i.type===t.int32)f=n.view.getInt32(n.byteOffset),!i.infinity||f>exports.Limits.int32Min&&f<exports.Limits.int32Max||(f*=Infinity),s=4;else if(i.type===t.float32)f=n.view.getFloat32(n.byteOffset),s=4;else if(i.type===t.float64)f=n.view.getFloat64(n.byteOffset),s=8;else if(i.type===t.string8||i.type===t.string16||i.type===t.string){s=y(i);var o=void 0,a=void 0;i.type===t.string8?(s+=o=n.view.getUint8(n.byteOffset),a=n.byteOffset+1):i.type===t.string16?(s+=o=n.view.getUint16(n.byteOffset),a=n.byteOffset+2):(s+=o=n.view.getUint32(n.byteOffset),a=n.byteOffset+4);var l=a+o;f=c(e.slice(a,l))}return i.compress?f=i.compress.unpack(f):r(i.multiplier)&&r(f)&&(f/=i.multiplier),n.byteOffset+=s,f}var u=new Map,v=!1;exports.pack=function(t,e,i){var n,r,f,o;if(void 0===i&&(i={}),void 0!==i.sharedBuffer)o=i.sharedBuffer;else if(i.cacheBufferByTemplate){var a=u.get(e);if(!a){v=!1;var y=null!==(n=i.bufferSizeInBytes)&&void 0!==n?n:exports.calculateBufferSize(t,e);if(v)throw Error("Dynamic data (array or string) can not be serialized with cacheBufferByTemplate option enabled.");a=new ArrayBuffer(y),u.set(e,a)}o=a}else{y=null!==(r=i.bufferSizeInBytes)&&void 0!==r?r:exports.calculateBufferSize(t,e);o=new ArrayBuffer(y)}return s(t,e,{byteOffset:null!==(f=i.byteOffset)&&void 0!==f?f:0,view:new DataView(o),onErrorCallback:i.onErrorCallback}),o},exports.unpack=function(t,e,i){void 0===i&&(i={});var n=i.byteOffset;return l(t,e,{byteOffset:void 0===n?0:n,view:new DataView(t)})};var c,b,g=function(t){return function(e){return t.decode(e)}};"function"==typeof TextDecoder&&(b=new TextDecoder,c=g(b));var x,d,O=function(t){return function(e){return t.encode(e)}};"function"==typeof TextEncoder&&(d=new TextEncoder,x=O(d)),exports.setTextHandler=function(t){x=O(t),c=g(t)};var w={pack:exports.pack,unpack:exports.unpack,utils:{setTextHandler:exports.setTextHandler,calculateBufferSize:exports.calculateBufferSize,Types:t}};exports.default=w;
