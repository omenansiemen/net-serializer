const NS = require('../..')

const coordinate = (prop) => ({
  type: NS.Types.int16,
  compress: {
    pack: (val, stack) => {
      return stack[stack.length - 3].target.position[prop] - val
    },
    unpack: (val) => {
      return val
    },
  },
  multiplier: 100
})

exports.data = {
  playerId: { type: NS.Types.uint8 },
  hits: [{
    state: {
      source: {
        position: {
          x: coordinate('x'), y: coordinate('y')
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