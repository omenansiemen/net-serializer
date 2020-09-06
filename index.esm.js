Object.defineProperty(exports,"__esModule",{value:!0}),exports.setTextHandler=exports.unpack=exports.pack=exports.calculateBufferSize=exports.Types=void 0;var t,e=function(t){return"boolean"==typeof t},n=function(t){return null!==t&&"object"==typeof t},r=function(t){return"object"==typeof t&&Array.isArray(t)},i=function(t){return r(t)&&(1===t.length||2===t.length)},o=function(t){return"number"==typeof t};!function(t){t.int8="int8",t.uint8="uint8",t.int16="int16",t.uint16="uint16",t.int32="int32",t.uint32="uint32",t.float32="float32",t.float64="float64",t.boolean="boolean",t.string8="string8",t.string16="string16",t.string="string"}(t=exports.Types||(exports.Types={}));var f=function(t){return"string"==typeof t.type};exports.calculateBufferSize=function(u,s,a){var y,c;if(void 0===a&&(a=0),r(u)&&i(s)){var g={type:null!==(c=null===(y=s[1])||void 0===y?void 0:y.lengthType)&&void 0!==c?c:t.uint32};a+=p(g,u.length),u.length>0&&(f(s[0])?a+=p(s[0])*u.length:a+=exports.calculateBufferSize(u[0],s[0])*u.length)}else Object.keys(s).forEach((function(t){var r=u[t],i=s[t];if(n(r))a+=exports.calculateBufferSize(r,i);else if(o(r)||e(r))a+=p(i,r);else if("string"==typeof r){var f=v(r),y=l(i.type);a+=p({type:y},f.byteLength),a+=f.byteLength}}));return a};var l=function(e){return e===t.string8?t.uint8:e===t.string16?t.uint16:t.uint32};function u(e,n,r){var i=p(n,r),f=new DataView(e.buffer,e.byteOffset,i);return o(n.multiplier)&&o(r)&&(r*=n.multiplier),n.type===t.uint8?(n.preventOverflow&&(r=r<0?0:r>255?255:r),f.setUint8(0,r)):n.type===t.int8?(n.preventOverflow&&(r=r<-128?-128:r>127?127:r),f.setInt8(0,r)):n.type===t.boolean?f.setInt8(0,!1===r?0:1):n.type===t.uint16?(n.preventOverflow&&(r=r<0?0:r>65535?65535:r),f.setUint16(0,r)):n.type===t.int16?(n.preventOverflow&&(r=r<-32768?-32768:r>32767?32767:r),f.setInt16(0,r)):n.type===t.uint32?(n.preventOverflow&&(r=r<0?0:r>4294967295?4294967295:r),f.setUint32(0,r)):n.type===t.int32?(n.preventOverflow&&(r=r<-2147483648?-2147483648:r>2147483647?2147483647:r),f.setInt32(0,r)):n.type===t.float32?f.setFloat32(0,r):n.type===t.float64?f.setFloat64(0,r):n.type!==t.string8&&n.type!==t.string16&&n.type!==t.string||r instanceof Uint8Array&&r.forEach((function(t,e){return f.setUint8(e,t)})),i}function p(e,n){var r=0;return e.type===t.int8||e.type===t.uint8||e.type===t.boolean?r=1:e.type===t.int16||e.type===t.uint16?r=2:e.type===t.int32||e.type===t.uint32||e.type===t.float32?r=4:e.type===t.string8||e.type===t.string16||e.type===t.string?r=n instanceof Uint8Array?n.byteLength:e.type===t.string8?1:e.type===t.string16?2:4:e.type===t.float64&&(r=8),r}function s(e,n,r){var i,f=p(n),l=new DataView(e,r.byteOffset,f);if(n.type===t.uint8)i=l.getUint8(0);else if(n.type===t.int8)i=l.getInt8(0);else if(n.type===t.uint16)i=l.getUint16(0);else if(n.type===t.int16)i=l.getInt16(0);else if(n.type===t.uint32)i=l.getUint32(0);else if(n.type===t.int32)i=l.getInt32(0);else if(n.type===t.float32)i=l.getFloat32(0);else if(n.type===t.float64)i=l.getFloat64(0);else if(n.type===t.boolean)i=0!==l.getInt8(0);else if(n.type===t.string8||n.type===t.string16||n.type===t.string){var u=void 0,s=void 0;n.type===t.string8?(f+=u=l.getUint8(0),s=r.byteOffset+1):n.type===t.string16?(f+=u=l.getUint16(0),s=r.byteOffset+2):(f+=u=l.getUint32(0),s=r.byteOffset+4);var y=s+u;i=a(e.slice(s,y))}return o(n.multiplier)&&o(i)&&(i/=n.multiplier),r.byteOffset+=f,i}exports.pack=function(s,a,y){void 0===y&&(y={});var c,g=y.sharedBuffer,b=y.returnCopy,d=void 0!==b&&b,x=y.freeBytes,h=void 0===x?0:x,O=y.bufferSizeInBytes,k=null!=O?O:exports.calculateBufferSize(s,a);return function s(a,y,c){var g,b;if(r(a)&&i(y)){var d={type:null!==(b=null===(g=y[1])||void 0===g?void 0:g.lengthType)&&void 0!==b?b:t.uint32};if(u(c,d,a.length),c.byteOffset+=p(d,a.length),f(y[0]))for(var x=0,h=a;x<h.length;x++){var O=h[x];u(c,y[0],O),c.byteOffset+=p(y[0])}else for(var k=0,T=a;k<T.length;k++)s(O=T[k],y[0],c)}else for(var w=0,U=Object.keys(y);w<U.length;w++){var B=U[w],E=a[B],I=y[B];if(n(E))s(E,I,c);else if(o(E)||e(E))u(c,I,E),c.byteOffset+=p(I,E);else{if("string"!=typeof E){var z="";throw void 0===E&&(z="Template property "+B+", is not found from data "+a),"function"==typeof c.onErrorCallback&&c.onErrorCallback(z),Error(z)}var S=v(E),m={type:l(I.type)};u(c,m,S.byteLength),c.byteOffset+=p(m,S.byteLength),u(c,I,S),c.byteOffset+=S.byteLength}}}(s,a,{byteOffset:0,buffer:c=void 0!==g?g:new ArrayBuffer(k+h),onErrorCallback:y.onErrorCallback}),void 0!==g&&d?c.slice(0,k):c},exports.unpack=function(e,n){return function e(n,r,l){var u,p,a,y,c;if(i(r)){c=[];for(var v=s(n,{type:null!==(p=null===(u=r[1])||void 0===u?void 0:u.lengthType)&&void 0!==p?p:t.uint32},l),g=null!==(y=null===(a=r[1])||void 0===a?void 0:a.unpackCallback)&&void 0!==y?y:null,b=0;b<(o(v)?v:0);b++){var d=e(n,r[0],l);g?null!=(d=g(d))&&c.push(d):c.push(d)}}else f(r)?c=s(n,r,l):(c={},Object.keys(r).forEach((function(t){f(r[t])?c[t]=s(n,r[t],l):c[t]=e(n,r[t],l)})));return c}(e,n,{byteOffset:0})};var a,y,c=function(t){return function(e){return t.decode(e)}};"function"==typeof TextDecoder&&(y=new TextDecoder,a=c(y));var v,g,b=function(t){return function(e){return t.encode(e)}};"function"==typeof TextEncoder&&(g=new TextEncoder,v=b(g)),exports.setTextHandler=function(t){v=b(t),a=c(t)};var d={pack:exports.pack,unpack:exports.unpack,utils:{setTextHandler:exports.setTextHandler,calculateBufferSize:exports.calculateBufferSize,Types:t}};exports.default=d;
