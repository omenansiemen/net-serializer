const NS = require('../..')

const multiplier = 100

const coordinate = () => ({
  type: NS.Types.int16,
  compress: {
    pack: (val) => {
      return val * multiplier
    },
    unpack: (val) => {
      return val / multiplier
    },
  },
  multiplier: multiplier
})

exports.template = {
  playerId: { type: NS.Types.uint8 },
  hits: [{
    state: {
      source: {
        position: {
          x: coordinate(), y: coordinate()
        },
        velocity: {
          x: { type: NS.Types.int8, preventOverflow: true },
          y: { type: NS.Types.int8, preventOverflow: true },
        },
      },
    },
    damage: { type: NS.Types.uint8, multiplier: 4 },
    isHeadShot: { type: NS.Types.boolean },
  }],
}