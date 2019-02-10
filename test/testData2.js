exports.template = {
  label: { type: 'string8' },
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

const ObjectMaker = () => ({
  identifier: {
    playerId: 1,
    serial: Math.random() * 65535,
  },
  body: {
    position: {
      x: Math.random() * 1000,
      y: Math.random() * 1000,
    },
    velocity: {
      x: Math.random() * (65535 / 2 / 1000),
      y: Math.random() * (65535 / 2 / 1000),
    },
    angle: Math.random() * (2 * Math.PI)
  },
  visible: true
})
const objects = Array.from({ length: 2 }).map(() => ObjectMaker())
exports.data = {
  label: 'Väinämöinen',
  objects
}