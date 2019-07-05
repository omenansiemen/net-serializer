exports.template = {
  _netSerializer_: {
    options: { arrayMaxLength: 'uint8'},
    template: [{
      numbers: [{value: { type: 'boolean' }}],
      label: { type: 'string8' },
      objects: [{
        identifier: {
          playerId: { type: 'uint8' },
          serial: { type: 'uint16' },
        },
        body: {
          position: {
            x: { type: 'int16' },
            y: { type: 'int16' },
          },
          velocity: {
            x: { type: 'int16', multiplier: 1000 },
            y: { type: 'int16', multiplier: 1000 },
          },
          angle: { type: 'uint16', multiplier: 65535 / (2 * Math.PI) }
        },
        visible: { type: 'boolean' }
      }],
      timestamp: {
        type: 'uint16',
        multiplier: 0.01, // To precision of tenth of a second
        preventOverflow: true,
      },
    }],
  }
}
