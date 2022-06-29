const mongoose = require('mongoose')

module.exports = {
  init: () => {
    if (!process.env.DATABASE_URL)
      throw new Error(`❌ | No MongoDB Client Key found in the configuration.`)

    // Init the connection and the Parser. Database connection link is protected in the Config
    mongoose.connect(process.env.DATABASE_URL, {
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })

    mongoose.set('useFindAndModify', false)
    
    //debugging, set to false to go into Production.
    mongoose.set('debug', false)
    // Set to false for Production by Pazi 12/7/2021 GMT +2 4.40pm
    
    mongoose.Promise = global.Promise

    // If Database errors, log it-
    mongoose.connection.on('err', err => {
      console.log('❌ | MONGO DB ERROR\n\n' + err)
    })

    // If Database disconnects, log it.
    mongoose.connection.on('disconnected', () => {
      console.log('❌ | DISCONNECTED FROM THE DATABASE')
    })

    // If Database successfully connects, log it.
    mongoose.connection.on('connected', () => {
      console.log('✅ | Successfully CONNECTED TO THE DATABASE')
    })
  }
}
