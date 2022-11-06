const NS = require('../..')

const Pack = (type) => {
  if (type === NS.Types.uint8) {
    return (value) => (
      (value < 0 ? 0 : (value > NS.Limits.uint8Max ? NS.Limits.uint8Max : value))
    )
  }
  if (type === NS.Types.int8) {
    return (value) => (
      (value < NS.Limits.int8Min ? NS.Limits.int8Min : (value > NS.Limits.int8Max ? NS.Limits.int8Max : value))
    )
  }
  if (type === NS.Types.uint16) {
    return (value) => (
      (value < 0 ? 0 : (value > NS.Limits.uint16Max ? NS.Limits.uint16Max : value))
    )
  }
  if (type === NS.Types.int16) {
    return (value) => (
      (value < NS.Limits.int16Min ? NS.Limits.int16Min : (value > NS.Limits.int16Max ? NS.Limits.int16Max : value))
    )
  }
  if (type === NS.Types.uint32) {
    return (value) => (
      (value < 0 ? 0 : (value > NS.Limits.uint32Max ? NS.Limits.uint32Max : value))
    )
  }
  if (type === NS.Types.int32) {
    return (value) => (
      (value < NS.Limits.int32Min ? NS.Limits.int32Min : (value > NS.Limits.int32Max ? NS.Limits.int32Max : value))
    )
  }
  return value => value
}

const Unpack = (type) => {
  if (type === NS.Types.uint8) {
    return (value) => {
      if (value === NS.Limits.uint8Max) {
        return Infinity
      }
      return value
    }
  }
  if (type === NS.Types.int8) {
    return (value) => {
      if (!(value > NS.Limits.int8Min && value < NS.Limits.int8Max)) {
        return value *= Infinity
      }
      return value
    }
  }
  if (type === NS.Types.uint16) {
    return (value) => {
      if (value === NS.Limits.uint16Max) {
        return Infinity
      }
      return value
    }
  }
  if (type === NS.Types.int16) {
    return (value) => {
      if (!(value > NS.Limits.int16Min && value < NS.Limits.int16Max)) {
        return value *= Infinity
      }
      return value
    }
  }
  if (type === NS.Types.uint32) {
    return (value) => {
      if (value === NS.Limits.uint32Max) {
        return Infinity
      }
      return value
    }
  }
  if (type === NS.Types.int32) {
    return (value) => {
      if (!(value > NS.Limits.int32Min && value < NS.Limits.int32Max)) {
        return value *= Infinity
      }
      return value
    }
  }
  return value => value
}

const Compress = (type) => {
  const pack = Pack(type)
  return {
    pack: (value) => {
      if (isFinite(value)) {
        return value
      }
      return pack(value)
    },
    unpack: Unpack(type),
  }
}

const int8Compress = Compress(NS.Types.int8)
const uint8Compress = Compress(NS.Types.uint8)
const int16Compress = Compress(NS.Types.int16)
const int32Compress = Compress(NS.Types.int32)

exports.template = {
  int8Positive: { type: NS.Types.int8, compress: int8Compress },
  int8PositiveReal: { type: NS.Types.int8, compress: int8Compress },
  int8PositiveRealMax: { type: NS.Types.int8, compress: int8Compress },
  int8Negative: { type: NS.Types.int8, compress: int8Compress },
  uint8Positive: { type: NS.Types.uint8, compress: uint8Compress },
  uint8PositiveRealMax: { type: NS.Types.uint8, compress: uint8Compress },
  uint8PositiveRealMaxWithoutInfinity: { type: NS.Types.uint8 },
  uint8PositiveReal: { type: NS.Types.uint8, compress: uint8Compress },
  int16Positive: { type: NS.Types.int16, compress: int16Compress },
  int16Negative: { type: NS.Types.int16, compress: int16Compress },
  uint16Positive: { type: NS.Types.uint16, compress: Compress(NS.Types.uint16) },
  int32Positive: { type: NS.Types.int32, compress: int32Compress },
  int32Negative: { type: NS.Types.int32, compress: int32Compress },
  uint32Positive: { type: NS.Types.uint32, compress: Compress(NS.Types.uint32) },
}