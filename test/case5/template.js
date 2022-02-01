const NS = require('../..')

exports.template = {
  type: { type: NS.Types.uint8 },
  objects: {
    props: {
      rotation: { type: NS.Types.uint16, multiplier: (65535 / (2 * Math.PI)) },
      shape: {
        x: { type: NS.Types.int16, multiplier: 10 },
        y: { type: NS.Types.int16, multiplier: 10 },
      },
    }
  },
}