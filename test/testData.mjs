export const data = [{
  identifier: {playerId: 1,serial: 11},
  body: {label: 'foo'}
},
{
  identifier: {playerId: 2,serial: 12,},
  body: {label: 'foo'}
},
{
  identifier: {playerId: 3,serial: 13,},
  body: {label: 'foo'}
}
]

export const dataTpl = [{
  identifier: {
    playerId: { _type: 'uint8' },
    serial: { _type: 'uint16' },
  },
  body: {
    label: { _type: 'string' }
  }
}]

export const numberArray = [
  1,2,3
]
export const numberArrayTpl = [
  { _type: 'uint8'}
]