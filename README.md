# NetSerializer
Type aware object serializer for sending structured data efficiently over network with WebRTC or WebSocket.

Uses template object to describe which properties will be serialized into binary data buffer. Property value can be either **number**, **boolean** or **string**.

**Numbers** can be serialized by using 1 to 4 bytes with following template types 
````javascript
 'int8' | 'uint8' | 'int16' | 'uint16' | 'int32' | 'uint32' | 'float32'
````

**Boolean** values uses one byte and **string** can use one to four bytes per character. Corresponding template types are 
````javascript
 'boolean' | 'string'
````

Object being serialized must be described by template object. Structure of the template object reflects the structure of the object being serialized. Primitive values in the template object are represented with object that implements IMetaValue interface.

````typescript
interface IMetaValue {
  type: MetaValueType
  multiplier?: number
  preventOverflow?: boolean
}
type MetaValueType = 'int8' | 'uint8' | 'int16' | 'uint16' | 'int32' | 'uint32' | 'float32' | 'boolean' | 'string'
````
Example of template object. 

```javascript
const template = {
  label: { type: 'string' },
  objects: [{
    identifier: {
      playerId: { type: 'uint8' },
      serial: { type: 'uint16' },
    },
    body: {
      position: {
        x: { type: 'int16' },
        y: { type: 'int16' },
      },
      velocity: {
        x: { type: 'int16', multiplier: 1000 },
        y: { type: 'int16', multiplier: 1000 },
      },
      angle: { type: 'uint16', multiplier: 65535 / (2 * Math.PI) }
    },
    visible: { type: 'boolean' }
  }]
}
```

With the above template the following data can be serialized. Note that template shape must overlap with the data shape, otherwise serialization will crash on exception!

````javascript
const data = {
  label: 'Väinämöinen',
  objects: [{
    identifier: { playerId: 1, serial: 1910 },
    body:
    {
      position: { x: 87.0156357205063, y: 96.13073426289853 },
      velocity: { x: 22.737924275167472, y: 28.14180572055013 },
      angle: 0.420235722176959
    },
    visible: false
  },
  {
    identifier: { playerId: 1, serial: 10215 },
    body:
    {
      position: { x: 937.3588667980719, y: 28.385851467368937 },
      velocity: { x: 11.643172722998244, y: 3.4230873467425926 },
      angle: 1.168204866279076
    },
    visible: true
  }]
}
import NetSerializer from 'net-serializer'
const arrayBuffer = NetSerializer.pack(data, template)
````

and deserialized object will look like 

````javascript
const expectedResult = {
  label: 'Väinämöinen',
  objects: [{
    identifier: { playerId: 1, serial: 1910 },
    body:
    {
      position: { x: 87, y: 96 },
      velocity: { x: 22.737, y: 28.141 },
      angle: 0.4202212741492046
    },
    visible: false
  },
  {
    identifier: { playerId: 1, serial: 10215 },
    body:
    {
      position: { x: 937, y: 28 },
      velocity: { x: 11.643, y: 3.423 },
      angle: 1.1681441944407733
    },
    visible: true
  }]
}

const deserializedData = NetSerializer.unpack(arrayBuffer, template)
JSON.stringify(deserializedData) === JSON.stringify(expectedResult)
// true
````

In this case serialized form of the data (47 bytes) uses space roughly ten times less than JSON stringified (459 bytes).

You can set custom text handler if TextEncoder and TextDecoder is not available in your platform (they are in browser and will be used automatically if custom text handler is not set).

````javascript
const textHandler = {
  encode: function (input) {
    const buffer = new Uint8Array(input.length)
    for (let i = 0; i < input.length; i++) {
      buffer[i] = input.charCodeAt(i)
    }
    return buffer
  },
  decode: function (input) {
    const buffer = new Uint8Array(input)
    return String.fromCharCode(...buffer)
  }
}

NetSerializer.utils.setTextHandler(textHandler)