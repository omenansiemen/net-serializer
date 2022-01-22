exports.original = {
  playerId: 1,
  hits: [{
    state: {
      source: {
        position: { x: 11.12323, y: 12 },
        velocity: { x: 3, y: 3 },
      },
      target: {
        position: { x: 50, y: 60 },
        velocity: { x: 1, y: 6 },
      },
    },
    damage: 40,
    isHeadShot: false,
  },
  {
    state: {
      source: {
        position: { x: 45, y: 122 },
        velocity: { x: 5, y: 8 },
      },
      target: {
        position: { x: 20, y: 95 },
        velocity: { x: 0, y: 0 },
      },
    },
    damage: 20,
    isHeadShot: true,
  }],
}

exports.expectedResult = {
  playerId: 1,
  hits: [{
    state: {
      source: {
        position: { x: 38.87, y: 48 },
        velocity: { x: 3, y: 3 },
      },
    },
    damage: 40,
    isHeadShot: false,
  },
  {
    state: {
      source: {
        position: { x: -25, y: -27 },
        velocity: { x: 5, y: 8 },
      },
    },
    damage: 20,
    isHeadShot: true,
  }],
}