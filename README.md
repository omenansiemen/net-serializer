# NetSerializer
_Type aware object serializer for sending structured data efficiently over network. Uses template object to describe which properties will be serialized into binary data buffer._

```typescript
const template = {
  label: { _type: 'string' },
  objects: [{
    identifier: {
      playerId: { _type: 'uint8' },
      serial: { _type: 'uint16' },
    },
    body: {
      position: {
        x: { _type: 'int16' },
        y: { _type: 'int16' },
      },
      velocity: {
        x: { _type: 'int16', _multiplier: 1000 },
        y: { _type: 'int16', _multiplier: 1000 },
      },
      angle: { _type: 'uint16', _multiplier: 65535 / (2 * Math.PI) }
    },
    visible: { _type: 'boolean' }
  }]
}
```