const mongoose = require('mongoose')
const client = require('../../index')

// Guild Settings such as ID (unique), prefix, disabled commands and channels.
const guild = mongoose.Schema({
  Id: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true
  },
  prefix: {
    type: mongoose.SchemaTypes.String,
    required: true,
    default: client.prefix
  },
  disabledCommands: {
    type: mongoose.SchemaTypes.Array,
    default: []
  },
  disabledChannels: {
    type: mongoose.SchemaTypes.Array,
    default: []
  },
  customPermission: {
    type: mongoose.SchemaTypes.Array,
    default: []
  },
  feature: {
    Automod: { type: mongoose.SchemaTypes.Boolean, default: false },
    Automod_score: { type: mongoose.SchemaTypes.Number, default: 0.5 },
    Modlogs: { 
      enable: { type: mongoose.SchemaTypes.Boolean, default: false },
      channel: { type: mongoose.SchemaTypes.String, default: null },
    },
    welcome: { 
      enable: { type: mongoose.SchemaTypes.Boolean, default: false },
      channel: { type: mongoose.SchemaTypes.String, default: null },
      type: { type: mongoose.SchemaTypes.String, default: null },
      message: { type: mongoose.SchemaTypes.String, default: null },
    }
  },
  ServerWar: {
    offline: { type: mongoose.SchemaTypes.Boolean, default: false },
    Server: {
      ServerVersion: { type: mongoose.SchemaTypes.Number, default: 0 },
      ServerHealth: { type: mongoose.SchemaTypes.Number, default: 20 },
      LatestHacker: { type: mongoose.SchemaTypes.String, default: null },
      Bounty: { type: mongoose.SchemaTypes.Number, default: 0 },
    }
  },
  partner: {
    partnerAC: { type: mongoose.SchemaTypes.Boolean, default: false },
    channel: { type: mongoose.SchemaTypes.String, default: null },
    description: { type: mongoose.SchemaTypes.String, default: null },
    color: { type: mongoose.SchemaTypes.String, default: null },
    banner: { type: mongoose.SchemaTypes.String, default: null },
    invite: { type: mongoose.SchemaTypes.String, default: null },
  }
}, { strict: false })
module.exports = mongoose.model('guild', guild)