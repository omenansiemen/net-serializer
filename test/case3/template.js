const NS = require('../..')

const numberOfGunPositions = 3
const weaponCompoundType = {
  type: NS.Types.uint8,
  compress: {
    pack: (prop) => {
      return numberOfGunPositions * prop.type + prop.placement
    },
    unpack: (val) => {
      val /= numberOfGunPositions
      const result = {
        type: Math.floor(val),
        placement: Math.round((val - Math.floor(val)) * numberOfGunPositions),
      }
      return result
    }
  },
}

exports.template = [{
  emptyArray: [{ value: { type: NS.Types.int8 } }],
  numberArray: [{ type: NS.Types.uint8 }],
  numberArrayWithInfinity: [
    {
      type: NS.Types.uint8,
      preventOverflow: true,
    },
    {
      lengthType: NS.Types.uint8,
      unpackCallback: element => element === NS.Limits.uint8Max ? Infinity : element,
    }
  ],
  numbersAsObject: [{ type: { type: NS.Types.int8 } }],
  label: { type: NS.Types.string8 },
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
    visible: { type: NS.Types.boolean },
    weapon: weaponCompoundType,
  }, { lengthType: NS.Types.uint8 }],
  timestamp: {
    type: NS.Types.uint16,
    multiplier: 0.01, // To precision of tenth of a second
    preventOverflow: true,
  },
}, { lengthType: NS.Types.uint8 }]