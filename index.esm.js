Object.defineProperty(exports,"__esModule",{value:!0}),exports.setTextHandler=exports.unpack=exports.pack=exports.calculateBufferSize=exports.Types=exports.Limits=void 0;var e,t=function(e){return"boolean"==typeof e},n=function(e){return null!==e&&"object"==typeof e},i=function(e){return function(e){return"object"==typeof e&&Array.isArray(e)}(e)&&(1===e.length||2===e.length)},r=function(e){return"number"==typeof e};exports.Limits={uint8Max:255,int8Min:-128,int8Max:127,uint16Max:65535,int16Min:-32768,int16Max:32767,uint32Max:4294967295,int32Min:-2147483648,int32Max:2147483647},function(e){e.int8="int8",e.uint8="uint8",e.int16="int16",e.uint16="uint16",e.int32="int32",e.uint32="uint32",e.float32="float32",e.float64="float64",e.boolean="boolean",e.string8="string8",e.string16="string16",e.string="string"}(e=exports.Types||(exports.Types={}));var f=function(e){return"string"==typeof e.type};function o(l,p,u){var y,c;if(i(p)){var v={type:null!==(c=null===(y=p[1])||void 0===y?void 0:y.lengthType)&&void 0!==c?c:e.uint32};if(u.byteOffset+=a(u,v,l.length),f(p[0]))for(var b=0,g=l;b<g.length;b++){var O=g[b];u.byteOffset+=a(u,p[0],O)}else for(var w=0,x=l;w<x.length;w++){O=x[w];u.objectStack.push(O),o(O,p[0],u),u.objectStack.pop()}}else for(var h=0,k=Object.keys(p);h<k.length;h++){var m=k[h],B=l[m],T=p[m];if(n(B))f(T)&&T.compress?u.byteOffset+=a(u,T,T.compress.pack(B,u.objectStack)):o(B,T,u);else if(r(B)||t(B))f(T)&&T.compress?u.byteOffset+=a(u,T,T.compress.pack(B,u.objectStack)):u.byteOffset+=a(u,T,B);else{if("string"!=typeof B){var S="";throw void 0===B&&(S="Template property "+m+", is not found from data "+l+"."),"function"==typeof u.onErrorCallback&&u.onErrorCallback(S),Error(S)}var z=d(B),U={type:s(T.type)};u.byteOffset+=a(u,U,z.byteLength),u.byteOffset+=a(u,T,z)}}}exports.calculateBufferSize=function(o,a,p){var u,y,v;if(void 0===p&&(p=0),i(a)&&Array.isArray(o)){c=!0;var b={type:null!==(y=null===(u=a[1])||void 0===u?void 0:u.lengthType)&&void 0!==y?y:e.uint32};if(p+=l(b,o.length),o.length>0)if(f(a[0])){var g=l(a[0]);p+=g*o.length}else if(null===(v=a[1])||void 0===v?void 0:v.pure){var O=p,w=(p=exports.calculateBufferSize(o[0],a[0],p))-O;p+=(o.length-1)*w}else for(var x=0;x<o.length;x++)p=exports.calculateBufferSize(o[x],a[0],p)}else Object.keys(a).forEach((function(e){var i=o[e],u=a[e];if(n(i))f(u)&&u.compress?p+=l(u):p=exports.calculateBufferSize(i,u,p);else if(r(i)||t(i))p+=l(u);else if("string"==typeof i){c=!0;var y=d(i),v=s(u.type);p+=l({type:v},y.byteLength),p+=y.byteLength}}));return p};var s=function(t){return t===e.string8?e.uint8:t===e.string16?e.uint16:e.uint32};function a(t,n,i){var f=0;return r(n.multiplier)&&r(i)&&(i*=n.multiplier),n.type===e.uint8?(n.preventOverflow&&(i=i<0?0:i>255?255:i),t.view.setUint8(t.byteOffset,i),f=1):n.type===e.int8?(n.preventOverflow&&(i=i<-128?-128:i>127?127:i),t.view.setInt8(t.byteOffset,i),f=1):n.type===e.boolean?(t.view.setInt8(t.byteOffset,!1===i?0:1),f=1):n.type===e.uint16?(n.preventOverflow&&(i=i<0?0:i>65535?65535:i),t.view.setUint16(t.byteOffset,i),f=2):n.type===e.int16?(n.preventOverflow&&(i=i<-32768?-32768:i>32767?32767:i),t.view.setInt16(t.byteOffset,i),f=2):n.type===e.uint32?(n.preventOverflow&&(i=i<0?0:i>4294967295?4294967295:i),t.view.setUint32(t.byteOffset,i),f=4):n.type===e.int32?(n.preventOverflow&&(i=i<-2147483648?-2147483648:i>2147483647?2147483647:i),t.view.setInt32(t.byteOffset,i),f=4):n.type===e.float32?(t.view.setFloat32(t.byteOffset,i),f=4):n.type===e.float64?(t.view.setFloat64(t.byteOffset,i),f=8):(n.type!==e.string8&&n.type!==e.string16&&n.type!==e.string||i instanceof Uint8Array&&i.forEach((function(e,n){t.view.setUint8(n+t.byteOffset,e)})),f=i.byteLength),f}function l(t,n){var i=0;return t.type===e.int8||t.type===e.uint8||t.type===e.boolean?i=1:t.type===e.int16||t.type===e.uint16?i=2:t.type===e.int32||t.type===e.uint32||t.type===e.float32?i=4:t.type===e.string8||t.type===e.string16||t.type===e.string?i=n instanceof Uint8Array?n.byteLength:t.type===e.string8?1:t.type===e.string16?2:4:t.type===e.float64&&(i=8),i}function p(t,n,o){var s,a,l,y,c;if(i(n)){c=[];for(var v=u(t,{type:null!==(a=null===(s=n[1])||void 0===s?void 0:s.lengthType)&&void 0!==a?a:e.uint32},o),b=null!==(y=null===(l=n[1])||void 0===l?void 0:l.unpackCallback)&&void 0!==y?y:null,g=0;g<(r(v)?v:0);g++){var d=p(t,n[0],o);b?null!=(d=b(d))&&c.push(d):c.push(d)}}else f(n)?c=u(t,n,o):(c={},Object.keys(n).forEach((function(e){var i=n[e];if(f(i))if(i.compress){var r=u(t,i,o);c[e]=i.compress.unpack(r)}else c[e]=u(t,i,o);else c[e]=p(t,i,o)})));return c}function u(t,n,i){var f,o=0;if(n.type===e.uint8)f=i.view.getUint8(i.byteOffset),o=1;else if(n.type===e.int8)f=i.view.getInt8(i.byteOffset),o=1;else if(n.type===e.boolean)f=0!==i.view.getInt8(i.byteOffset),o=1;else if(n.type===e.uint16)f=i.view.getUint16(i.byteOffset),o=2;else if(n.type===e.int16)f=i.view.getInt16(i.byteOffset),o=2;else if(n.type===e.uint32)f=i.view.getUint32(i.byteOffset),o=4;else if(n.type===e.int32)f=i.view.getInt32(i.byteOffset),o=4;else if(n.type===e.float32)f=i.view.getFloat32(i.byteOffset),o=4;else if(n.type===e.float64)f=i.view.getFloat64(i.byteOffset),o=8;else if(n.type===e.string8||n.type===e.string16||n.type===e.string){o=l(n);var s=void 0,a=void 0;n.type===e.string8?(o+=s=i.view.getUint8(i.byteOffset),a=i.byteOffset+1):n.type===e.string16?(o+=s=i.view.getUint16(i.byteOffset),a=i.byteOffset+2):(o+=s=i.view.getUint32(i.byteOffset),a=i.byteOffset+4);var p=a+s;f=v(t.slice(a,p))}return r(n.multiplier)&&r(f)&&(f/=n.multiplier),i.byteOffset+=o,f}var y=new Map,c=!1;exports.pack=function(e,t,n){var i,r,f,s;if(void 0===n&&(n={}),void 0!==n.sharedBuffer)s=n.sharedBuffer;else if(n.cacheBufferByTemplate){var a=y.get(t);if(!a){c=!1;var l=null!==(i=n.bufferSizeInBytes)&&void 0!==i?i:exports.calculateBufferSize(e,t);if(c)throw Error("Dynamic data (array or string) can not be serialized with cacheBufferByTemplate option enabled.");a=new ArrayBuffer(l),y.set(t,a)}s=a}else{l=null!==(r=n.bufferSizeInBytes)&&void 0!==r?r:exports.calculateBufferSize(e,t);s=new ArrayBuffer(l)}return o(e,t,{objectStack:[e],byteOffset:null!==(f=n.byteOffset)&&void 0!==f?f:0,view:new DataView(s),onErrorCallback:n.onErrorCallback}),s},exports.unpack=function(e,t,n){void 0===n&&(n={});var i=n.byteOffset;return p(e,t,{byteOffset:void 0===i?0:i,view:new DataView(e)})};var v,b,g=function(e){return function(t){return e.decode(t)}};"function"==typeof TextDecoder&&(b=new TextDecoder,v=g(b));var d,O,w=function(e){return function(t){return e.encode(t)}};"function"==typeof TextEncoder&&(O=new TextEncoder,d=w(O)),exports.setTextHandler=function(e){d=w(e),v=g(e)};var x={pack:exports.pack,unpack:exports.unpack,utils:{setTextHandler:exports.setTextHandler,calculateBufferSize:exports.calculateBufferSize,Types:e}};exports.default=x;
