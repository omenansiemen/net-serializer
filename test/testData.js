const personTpl = {
  id: { _type: 'uint32' },
  name: {
    first: { _type: 'string' },
    last: { _type: 'string' }
  },
  dayOfBirth: {
    year: { _type: 'int16' },
    month: { _type: 'uint8' },
    day: { _type: 'uint8' }
  },
  weight: { _type: 'uint16', '_multiplier': 10 },
  height: { _type: 'uint16', '_multiplier': 10 },
  record: {_type: 'uint16', '_multiplier': 100}
}
exports.personsTpl = [personTpl]
exports.persons = [{
  id: 1,
  name: {
    first: 'Seppo',
    last: 'Räty'
  },
  dayOfBirth: {
    year: 1968,
    month: 4,
    day: 27
  },
  weight: 118.9,
  height: 189,
  record: 90.60
},
{
  id: 2,
  name: {
    first: 'Kimmo',
    last: 'Kinnunen'
  },
  dayOfBirth: {
    year: 1968,
    month: 4,
    day: 27
  },
  weight: 99.5,
  height: 187.5,
  record: 85.96
}]