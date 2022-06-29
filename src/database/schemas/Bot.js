const mongoose = require('mongoose')

// Generate Premium Code
const bot = mongoose.Schema({
  Id: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true
  },
  Alert: {
    type: mongoose.SchemaTypes.String,
    default: null
  },
  AlertTimestamp: {
    type: mongoose.SchemaTypes.Number,
    default: null
  }

})

module.exports = mongoose.model('Bot', bot)
