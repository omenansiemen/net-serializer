exports.template = {
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