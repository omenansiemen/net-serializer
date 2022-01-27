const NS = require('../..')

exports.template = {
  label: { type: NS.Types.string },
  objects: [{
    identifier: {
      playerId: { type: NS.Types.uint8 },
      serial: { type: NS.Types.uint16 },
    },
    body: {
      position: {
        x: { type: NS.Types.int16 },
        y: { type: NS.Types.int16 },
      },
      velocity: {
        x: { type: NS.Types.int16, multiplier: 1000 },
        y: { type: NS.Types.int16, multiplier: 1000 },
      },
      angle: { type: NS.Types.uint16, multiplier: 65535 / (2 * Math.PI) }
    },
    visible: { type: NS.Types.boolean }
  }]
}