const mongoose = require('mongoose')

// The heart of the User, here is everything saved that the User does.
// Such as Levels, Courses, Premium, Enrolled, XP, Leaderboard.
const user = mongoose.Schema({
  Id: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true
  },
  isPremium: {
    type: mongoose.SchemaTypes.Boolean,
    default: false
  },
  inventory: { 
    type: Array, 
    default: [] 
  },
  hide: {
    type: mongoose.SchemaTypes.Boolean,
    default: false
  },
  isBanned: {
    type: mongoose.SchemaTypes.Boolean,
    default: false
  },
  BanReason: {
    type: mongoose.SchemaTypes.String,
    default: null
  },
  xp: {
    type: mongoose.SchemaTypes.Number,
    default: 0
  },
  enrolled: {
    type: mongoose.SchemaTypes.Number,
    default: null
  },
  premium: {
    redeemedBy: {
      type: mongoose.SchemaTypes.Array,
      default: null
    },

    redeemedAt: {
      type: mongoose.SchemaTypes.Number,
      default: null
    },

    expiresAt: {
      type: mongoose.SchemaTypes.Number,
      default: null
    },

    plan: {
      type: mongoose.SchemaTypes.String,
      default: null
    }
  },
  economy: {
    bank: { type: Number, default: null },
    wallet: { type: Number, default: null },
    streak: {
      alltime: { type: Number, default: 0 },
      current: { type: Number, default: 0 },
      timestamp: { type: Number, default: 0 }
    },
    isPrisoner: { type: mongoose.SchemaTypes.Boolean, default: false },
    shard: { type: Number, default: null }
  },
  profile: {
    bio: {type: String, default: 'No bio written.'},
    background: {type: String, default: null},
    pattern: {type: String, default: null},
    emblem: {type: String, default: null},
    hat: {type: String, default: null},
    wreath: {type: String, default: null},
    color: {type: String, default: null},
    birthday: {type: String, default: null},
    inventory: {type: Array, default: []},
    HackerLevel: {type: Number, default: 0},
    masking: {type: Boolean, default: false},
    badges: {type: Array, default: [0]}
  },
  minigames: {
    wordle: {type: Boolean, default: false},
  },
  vote: {
    lastVoted: Number,
    votes: Number,
  }
}, { strict: false })
module.exports = mongoose.model('user', user)
