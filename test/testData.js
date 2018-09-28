const personTpl = {
  id: { type: 'uint32' },
  name: {
    first: { type: 'string' },
    last: { type: 'string' }
  },
  dayOfBirth: {
    year: { type: 'int16' },
    month: { type: 'uint8' },
    day: { type: 'uint8' }
  },
  weight: { type: 'uint16', 'multiplier': 10 },
  height: { type: 'uint16', 'multiplier': 10 },
  record: {type: 'uint16', 'multiplier': 100}
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