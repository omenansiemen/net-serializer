const NS = require('../..')

exports.original = {
  int8Positive: Infinity,
  int8PositiveReal: NS.Limits.int8Max - 1,
  int8PositiveRealMax: NS.Limits.int8Max,
  int8Negative: -Infinity,
  uint8Positive: Infinity,
  uint8PositiveRealMax: NS.Limits.uint8Max,
  uint8PositiveRealMaxWithoutInfinity: NS.Limits.uint8Max,
  uint8PositiveReal: NS.Limits.uint8Max - 1,
  int16Positive: Infinity,
  int16Negative: -Infinity,
  uint16Positive: Infinity,
  int32Positive: Infinity,
  int32Negative: -Infinity,
  uint32Positive: Infinity,
}


exports.expectedResult = {
  int8Positive: Infinity,
  int8PositiveReal: NS.Limits.int8Max - 1,
  int8PositiveRealMax: Infinity,
  int8Negative: -Infinity,
  uint8Positive: Infinity,
  uint8PositiveRealMax: Infinity,
  uint8PositiveRealMaxWithoutInfinity: NS.Limits.uint8Max,
  uint8PositiveReal: NS.Limits.uint8Max - 1,
  int16Positive: Infinity,
  int16Negative: -Infinity,
  uint16Positive: Infinity,
  int32Positive: Infinity,
  int32Negative: -Infinity,
  uint32Positive: Infinity,
}