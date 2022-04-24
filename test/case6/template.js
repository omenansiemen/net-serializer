const NS = require('../..')

exports.template = {
  int8Positive: { type: NS.Types.int8, infinity: true },
  int8PositiveReal: { type: NS.Types.int8, infinity: true },
  int8PositiveRealMax: { type: NS.Types.int8, infinity: true },
  int8Negative: { type: NS.Types.int8, infinity: true },
  uint8Positive: { type: NS.Types.uint8, infinity: true },
  uint8PositiveRealMax: { type: NS.Types.uint8, infinity: true },
  uint8PositiveRealMaxWithoutInfinity: { type: NS.Types.uint8 },
  uint8PositiveReal: { type: NS.Types.uint8, infinity: true },
  int16Positive: { type: NS.Types.int16, infinity: true },
  int16Negative: { type: NS.Types.int16, infinity: true },
  uint16Positive: { type: NS.Types.uint16, infinity: true },
  int32Positive: { type: NS.Types.int32, infinity: true },
  int32Negative: { type: NS.Types.int32, infinity: true },
  uint32Positive: { type: NS.Types.uint32, infinity: true },
}