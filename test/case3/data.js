const text = 'Väinämöinen Väinämöinen \n'
const numberOfItems = 255
const numbersAsObject = Array.from(
  { length: numberOfItems },
  (v, i) => ({ type: Math.round(0 - (numberOfItems / 2)) + i }),
)

exports.original = Array.from({ length: numberOfItems }).map(() => ({
  emptyArray: [],
  numberArray: [45, 6, 34, 160],
  numberArrayWithInfinity: [45, 6, 34, 160, Infinity],
  numbersAsObject,
  label: text,
  objects: [{
    identifier: { playerId: 1, serial: 1910 },
    body:
    {
      position: { x: 87.0156357205063, y: 96.13073426289853 },
      velocity: { x: 22.737924275167472, y: 28.14180572055013 },
      angle: 0.420235722176959
    },
    visible: false,
    weapon: {
      type: 0,
      placement: 0,
    },
  },
  {
    identifier: { playerId: 1, serial: 10215 },
    body:
    {
      position: { x: 937.3588667980719, y: 28.385851467368937 },
      velocity: { x: 11.643172722998244, y: 3.4230873467425926 },
      angle: 1.168204866279076
    },
    visible: true,
    weapon: {
      type: 5,
      placement: 2,
    },
  }],
  timestamp: Infinity,
}))

exports.expectedResult = Array.from({ length: numberOfItems }).map(() => ({
  emptyArray: [],
  numberArray: [45, 6, 34, 160],
  numberArrayWithInfinity: [45, 6, 34, 160, Infinity],
  numbersAsObject,
  label: text,
  objects: [{
    identifier: { playerId: 1, serial: 1910 },
    body:
    {
      position: { x: 87, y: 96 },
      velocity: { x: 22.737, y: 28.141 },
      angle: 0.4202212741492046
    },
    visible: false,
    weapon: {
      type: 0,
      placement: 0,
    },
  },
  {
    identifier: { playerId: 1, serial: 10215 },
    body:
    {
      position: { x: 937, y: 28 },
      velocity: { x: 11.643, y: 3.423 },
      angle: 1.1681441944407733
    },
    visible: true,
    weapon: {
      type: 5,
      placement: 2,
    },
  }],
  timestamp: 6553500,
}))