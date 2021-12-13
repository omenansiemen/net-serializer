const NST = require('../index').Types

const numberOfGunPositions = 3
const weaponCompoundType = {
  type: NST.uint8,
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
  emptyArray: [{ value: { type: NST.int8 } }],
  numberArray: [{ type: NST.uint8 }],
  numbersAsObject: [{ type: { type: NST.int8 } }],
  label: { type: NST.string8 },
  objects: [{
    identifier: {
      playerId: { type: NST.uint8 },
      serial: { type: NST.uint16 },
    },
    body: {
      position: {
        x: { type: NST.int16 },
        y: { type: NST.int16 },
      },
      velocity: {
        x: { type: NST.int16, multiplier: 1000 },
        y: { type: NST.int16, multiplier: 1000 },
      },
      angle: { type: NST.uint16, multiplier: 65535 / (2 * Math.PI) }
    },
    visible: { type: NST.boolean },
    weapon: weaponCompoundType,
  }, { lengthType: NST.uint8 }],
  timestamp: {
    type: NST.uint16,
    multiplier: 0.01, // To precision of tenth of a second
    preventOverflow: true,
  },
}, { lengthType: NST.uint8 }]

exports.template2 = {
  type: { type: NST.uint8 },
  objects: [{
    identifier: {
      playerId: { type: NST.uint8 },
      serial: { type: NST.uint16 },
    },
    state: {
      position: {
        x: { type: NST.int16, preventOverflow: true, multiplier: 20 },
        y: { type: NST.int16, preventOverflow: true, multiplier: 20 },
      }
    },
    props: {
      sourceIdentifier: {
        // playerId is not needed because it can be get from object's identifier
        serial: { type: NST.uint16 },
      },
      weapon: { type: NST.uint8 },
    },
  }]
}