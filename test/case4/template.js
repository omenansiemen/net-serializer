const NS = require('../..')

const coordinate = (prop) => ({
  type: NS.Types.int16,
  compress: {
    pack: (val, stack = []) => {
      const element = stack[stack.length - 1]
      return element.state.target.position[prop] - val
    },
    unpack: (val) => {
      return val
    },
  },
  multiplier: 100
})

exports.template = {
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