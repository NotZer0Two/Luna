const Discord = require('discord.js')

const port = 8000

const express = require('express')
const app = express()

const url = require('url')
const path = require('path')

const MongoStore = require('connect-mongo')
const passport = require('passport')
const session = require('express-session')

const Strategy = require('passport-discord').Strategy
const ejs = require('ejs')
const bodyParser = require('body-parser')
const moment = require('moment')

const User = require('../database/schemas/User')
const minifyHTML = require('express-minify-html-terser')
const Guild = require('../database/schemas/Guild')

const Topgg = require("@top-gg/sdk");
const webhooktopgg = new Topgg.Webhook(process.env.TOPGGVOTE)

// Website Ratelimit for Cooldowns
const rateLimit = require('express-rate-limit')
const { guilds } = require('..')
const contactCooldown = new Set()
const nicknameCooldown = new Set()

const rateLimiter = rateLimit({
  windowMs: 60 * 1000,
  statusCode: 429,
  max: 50,
  message: 'Too many requests, please try again in a minute'
})

module.exports = async client => {
  app.use(express.static('src/dashboard/static'))
  const templateDir = path.resolve('src/dashboard/templates')
  passport.serializeUser((user, done) => done(null, user))
  passport.deserializeUser((obj, done) => done(null, obj))
  passport.use(
    new Strategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: `${process.env.DOMAIN}/callback`,
        response_type: `token`,
        scope: ['identify', 'guilds']
      },
      (accessToken, refreshToken, profile, done) => {
        process.nextTick(() => done(null, profile))
      }
    )
  )

  app.use(rateLimiter)
  app.use(
    session({
      secret:
        'aASDASDewwfSAFasdadasdasdasdasadasdasdwqd3242323yvu4vhy234hy2343v2h4234hjv23423hjb423hjb4234hjb324234324vj324234byjdasdasdadasdad',
      resave: true,
      saveUninitialized: true,
      cookie: { maxAge: Date.now() + 2629800000 },
      store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL })
    })
  )

  app.locals.moment = moment

  const checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next()
    req.session.backURL = req.url
    render(res, req, 'other/login/login.ejs')
  }

  app.use(
    minifyHTML({
      override: true,
      exception_url: false,
      htmlMinifier: {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeEmptyAttributes: true,
        minifyJS: true
      }
    })
  )

  app.enable('trust proxy')
  app.use(passport.initialize())
  app.use(passport.session())
  app.engine('html', ejs.renderFile)
  app.set('view engine', 'html')
  app.use(bodyParser.json())
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  )

  const limit = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: 'Too many requests, please try again in a minute',
    statusCode: 429
  })

  const render = (res, req, template, data = {}) => {
    var hostname = req.headers.host
    var pathname = url.parse(req.url).pathname
    const websiteData = {
      client: client,
      hostname: hostname,
      pathname: pathname,
      path: req.path,
      user: req.isAuthenticated() ? req.user : null,
      url: res,
      req: req,
      config: process.env,
      https: 'https://',
      domain: process.env.DOMAIN
    }
    res.render(
      path.resolve(`${templateDir}${path.sep}${template}`),
      Object.assign(websiteData, data)
    )
  }

  // Login endpoint
  app.get(
    '/login',
    (req, res, next) => {
      if (req.user) return res.redirect('/')
      if (req.session.backURL) {
        req.session.backURL = req.session.backURL
      } else if (req.headers.referer) {
        const parsed = url.parse(req.headers.referer)
        if (parsed.hostname === app.locals.domain) {
          req.session.backURL = parsed.path
        }
      } else {
        req.session.backURL = '/'
      }
      next()
    },
    passport.authenticate('discord', { prompt: 'none' })
  )

  //discord endpoint
  app.get('/discord', (req, res) => {
    res.redirect('https://discord.gg/apJM8wmwBT')
  })

  //invite endpoint
  app.get('/invite', (req, res) => {
    res.redirect(
      'https://discord.com/oauth2/authorize?client_id=673952206663319563&permissions=240518548544&scope=bot'
    )
  })

  //invite api
  app.get('/api/invite', (req, res) => {
    const url = req.protocol + '://' + req.get('host') + req.originalUrl
    const redirect = new URL(url).searchParams.get('guild_id')
    if (redirect) {
      res.redirect(`/panel/${redirect}`)
    } else return res.json({ error: 'No guild ID requested' })
  })

  //policy
  app.get('/policy', (req, res) => {
    return render(res, req, 'other/policy/policy.ejs')
  })

  //dashboard
  app.get('/panel', checkAuth, (req, res) => {
    render(res, req, 'dashboard/dashboard.ejs', {
      perms: Discord.Permissions
    })
  })

  // dashboard endpoint (settings)
  app.get('/panel/:guildID', checkAuth, async (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID)
    if (!guild) {
      res.status(500)
      return render(res, req, 'other/error/error.ejs', {
        error: 'Invalid Guild Provided'
      })
    }

    const member = guild.members.cache.get(req.user.id)
    if (!member) {
      res.status(500)
      return render(res, req, 'other/error/error.ejs', {
        error: 'You are not a member of this Guild'
      })
    }
    if (!member.permissions.has('MANAGE_GUILD')) {
      res.status(500)
      return render(res, req, 'other/error/error.ejs', {
        error: 'You are not allowed to view this Page'
      })
    }

    render(res, req, 'dashboard/dashboard/index.ejs', {
      guild: guild
    })
  })

  app.get('/me', checkAuth, async (req, res) => {
    let user = client.userSettings.get(req.user.id)

    if (!user) {
      const findUser = await User.findOne({ Id: req.user.id })
      if (!findUser) {
        const newUser = await User.create({ Id: req.user.id })
        client.userSettings.set(req.user.id, newUser)
        user = newUser
      }
    }

    render(res, req, 'dashboard/dashboard/me/me.ejs', {
      settings: user
    })
  })

  app.post('/me', checkAuth, limit, async (req, res) => {
    let user = await User.findOne({ Id: req.user.id })
    if (!user) {
      user = await User.create({ Id: req.user.id })
      client.userSettings.set(req.user.id, user)
    }

    const data = req.body

    if (data.toggle) {
      user.hide = true
    } else {
      user.hide = false
    }

    const newUser = await user.save()
    client.userSettings.set(req.user.id, newUser)

    res.status(200)
    res.send({ status: 200, user: newUser })
  })

  // leaderboard
  app.get('/leaderboard', async (req, res) => {
    const users = await User.find({ hide: false })
    .sort({ wallet: 0 })
    .limit(10)

    const array = []
    let i = 1
    for (let user of users) {
      const db = client.userSettings.get(user.Id)
      if (db) {
        const fetch = client.users.cache.get(user.Id)
        if (fetch && fetch.username) {
          let wallet = 0
          if (user.economy.wallet > 0 ) {
              wallet = user.economy.wallet
            } else if (user.economy.wallet > 0 && user.economy.bank > 0) {
              wallet = user.economy.wallet + user.economy.bank
            }

          const obj = {
            name: fetch.tag,
            avatar: fetch.avatar,
            id: user.Id,
            wallet: wallet
          }

          array.push(obj)
          i++
        }
      }
    }

    render(res, req, 'dashboard/dashboard/leaderboard/leaderboard.ejs', {
      users: array || [],
      isGuild: false,
      guild: null
    })
  })

  // dashboard endpoint for leaderboard
  app.get('/panel/:guildID/leaderboard/', checkAuth, async (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID)
    if (!guild) {
      res.status(500)
      return render(res, req, 'other/error/error.ejs', {
        error: 'Invalid Guild Provided'
      })
    }

    const member = guild.members.cache.get(req.user.id)
    if (!member) {
      res.status(500)
      return render(res, req, 'other/error/error.ejs', {
        error: 'You are not a member of this Guild'
      })
    }
    if (!member.permissions.has('MANAGE_GUILD')) {
      res.status(500)
      return render(res, req, 'other/error/error.ejs', {
        error: 'You are not allowed to view this Page'
      })
    }
    const users = await User.find({ hide: false })
    .sort({ wallet: 0 })
    .limit(10)

    const array = []
    let i = 1
    for (let user of users) {
      const db = client.userSettings.get(user.Id)
      if (db) {
        const fetch = guild.members.cache.get(user.Id)
        if (fetch && fetch.user.username) {
          let wallet = 0
          if (user.economy.wallet > 0 ) {
              wallet = user.economy.wallet
            } else if (user.economy.wallet > 0 && user.economy.bank > 0) {
              wallet = user.economy.wallet + user.economy.bank
            }

          const obj = {
            name: fetch.user.username + '#' + fetch.user.discriminator,
            avatar: fetch.user.avatar,
            id: user.Id,
            wallet: wallet
          }

          array.push(obj)
          i++
        }
      }
    }
  

    render(res, req, 'dashboard/dashboard/leaderboard/leaderboard.ejs', {
      guild: guild,
      alert: null,
      users: array,
      isGuild: true
    })
})

  // dashboard endpoint for settings general page
  app.get('/panel/:guildID/settings/', checkAuth, async (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID)
    if (!guild) {
      res.status(500)
      return render(res, req, 'other/error/error.ejs', {
        error: 'Invalid Guild Provided'
      })
    }

    const member = guild.members.cache.get(req.user.id)
    if (!member) {
      res.status(500)
      return render(res, req, 'other/error/error.ejs', {
        error: 'You are not a member of this Guild'
      })
    }
    if (!member.permissions.has('MANAGE_GUILD')) {
      res.status(500)
      return render(res, req, 'other/error/error.ejs', {
        error: 'You are not allowed to view this Page'
      })
    }

    let settings = client.guildSettings.get(guild.id)

    if (!settings) {
      const findSettings = await Guild.findOne({
        Id: guild.id
      })

      if (!findSettings) {
        const newGuild = await Guild.create({
          Id: guild.id,
          prefix: process.env.PREFIX
        })

        client.guildSettings.set(guild.id, newGuild)
        settings = client.guildSettings.get(guild.id)
      }
    }

    if (!settings)
      return render(res, req, 'other/error/error.ejs', {
        error: 'Please wait a little and try again.'
      })

    render(res, req, 'dashboard/dashboard/settings/settings.ejs', {
      guild: guild,
      settings: settings,
      alert: null
    })
  })

  // dashboard endpoint for settings general page - post
  app.post('/panel/:guildID/settings', checkAuth, async (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID)
    if (!guild) {
      res.status(500)
      return render(res, req, 'other/error/error.ejs', {
        error: 'Invalid Guild Provided'
      })
    }

    const member = guild.members.cache.get(req.user.id)
    if (!member) {
      res.status(500)
      return render(res, req, 'other/error/error.ejs', {
        error: 'You are not a member of this Guild'
      })
    }
    if (!member.permissions.has('MANAGE_GUILD')) {
      res.status(500)
      return render(res, req, 'other/error/error.ejs', {
        error: 'You are not allowed to view this Page'
      })
    }

    // Query database settings for blocking channels
    let settings = await Guild.findOne({
      Id: guild.id
    })

    if (!settings) {
      const newGuild = await Guild.create({
        Id: guild.id,
        prefix: process.env.PREFIX
      })

      client.guildSettings.set(guild.id, newGuild)
      settings = await Guild.findOne({
        Id: guild.id
      })
    }

    if (!settings) {
      res.status(200)
      return render(res, req, 'other/error/error.ejs', {
        error: 'Please cool down and try again.'
      })
    }

    const data = req.body

    // Setting nickname, blocking category and channels (included cooldown)
    try {
      if (
        (data.nickname && data.nickname !== guild.me.nickname) ||
        guild.me.user.username
      ) {
        const nickname = data.nickname
        if (nickname.length < 32) {
          if (!nicknameCooldown.has(guild.id)) {
            nicknameCooldown.add(guild.id)
            setTimeout(() => {
              nicknameCooldown.delete(guild.id)
            }, 10000)
            try {
              await guild.me.setNickname(nickname)
            } catch (err) {
              render(res, req, 'dashboard/dashboard/settings/settings.ejs', {
                guild: guild,
                settings: settings,
                alert: err
              })
            }
          }
        } else {
          render(res, req, 'dashboard/dashboard/settings/settings.ejs', {
            guild: guild,
            settings: settings,
            alert: 'Nickname length must be under 32 characters' // If the Nickname is too long, return is
          })
          return;
        }
      }

      // Changing Prefix 
      if (data.prefix && data.prefix !== settings.prefix) {
        const prefix = data.prefix.trim().replace(/\s/g, '')
        if (!prefix || !prefix.length) {
          settings.prefix = process.env.PREFIX
        } else {
          if (prefix.length < 5) {
            settings.prefix = prefix
          } else {
            render(res, req, 'dashboard/dashboard/settings/settings.ejs', {
              guild: guild,
              settings: settings,
              alert: 'Prefix length must be under 5 characters'
            })
            return
          }
        }
      } else if (!data.prefix) settings.prefix = process.env.PREFIX
    } catch {
      return res.send('Something seems wrong. Try again later')
    }

    // Save the Guild Settings <Prefix, Blocks, Nickname>
    const newSettings = await settings.save({ new: true })
    client.guildSettings.set(guild.id, newSettings)

    res.status(200)
    render(res, req, 'dashboard/dashboard/settings/settings.ejs', {
      guild: guild,
      settings: settings,
      alert: 'success'
    })
  })

  // dashboard endpoint for toggles
  app.get('/panel/:guildID/toggles/', checkAuth, async (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID)
    if (!guild) {
      res.status(500)
      return render(res, req, 'other/error/error.ejs', {
        error: 'Invalid Guild Provided'
      })
    }

    // Fetch the Servers the Member is in (with permissions)
    const member = guild.members.cache.get(req.user.id)
    if (!member) {
      res.status(500)
      return render(res, req, 'other/error/error.ejs', {
        error: 'You are not a member of this Guild'
      })
    }

    // Check permissions to manage the Bot
    if (!member.permissions.has('MANAGE_GUILD')) {
      res.status(500)
      return render(res, req, 'other/error/error.ejs', {
        error: 'You are not allowed to view this Page'
      })
    }

    // Loop trough the Settings of the Guild and load them (if there arent one, create it!)
    let settings = client.guildSettings.get(guild.id)

    if (!settings) {
      const findSettings = await Guild.findOne({
        Id: guild.id
      })

      if (!findSettings) {
        const newGuild = await Guild.create({
          Id: guild.id,
          prefix: process.env.PREFIX
        })

        client.guildSettings.set(guild.id, newGuild)
        settings = client.guildSettings.get(guild.id)
      }
    }

    if (!settings)
      return render(res, req, 'other/error/error.ejs', {
        error: 'Please wait a little and try again.'
      })

    render(res, req, 'dashboard/dashboard/toggles/toggles.ejs', {
      guild: guild,
      settings: settings,
      alert: null,
      commands: [...client.commands
      .filter(cmd => cmd.category !== '👑 Owner').values()
      ]
    })
  })

  // toggles post
  app.post('/panel/:guildID/toggles', checkAuth, async (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildID)
    if (!guild) {
      res.status(500)
      return render(res, req, 'other/error/error.ejs', {
        error: 'Invalid Guild Provided'
      })
    }

    const member = guild.members.cache.get(req.user.id)
    if (!member) {
      res.status(500)
      return render(res, req, 'other/error/error.ejs', {
        error: 'You are not a member of this Guild'
      })
    }
    if (!member.permissions.has('MANAGE_GUILD')) {
      res.status(500)
      return render(res, req, 'other/error/error.ejs', {
        error: 'You are not allowed to view this Page'
      })
    }

    let settings = await Guild.findOne({
      Id: guild.id
    })

    if (!settings) {
      const newGuild = await Guild.create({
        Id: guild.id,
        prefix: process.env.PREFIX
      })

      client.guildSettings.set(guild.id, newGuild)
      settings = await Guild.findOne({
        Id: guild.id
      })
    }

    if (!settings) {
      res.status(200)
      return render(res, req, 'other/error/error.ejs', {
        error: 'Please cool down and try again.'
      })
    }

    const data = req.body

    if (data.blockChannels) {
      if (typeof data.blockChannels === 'string') {
        settings.disabledChannels = [data.blockChannels]
      } else {
        settings.disabledChannels = data.blockChannels
      }
    } else settings.disabledChannels = []

    if (data.blockCommands) {
      if (typeof data.blockCommands === 'string') {
        settings.disabledCommands = [data.blockCommands]
      } else {
        settings.disabledCommands = data.blockCommands
      }
    } else settings.disabledCommands = []

    const newSettings = await settings.save({ new: true })
    client.guildSettings.set(guild.id, newSettings)

    res.status(200)
    render(res, req, 'dashboard/dashboard/toggles/toggles.ejs', {
      guild: guild,
      settings: settings,
      alert: 'success',
      commands: [...client.commands
        .filter(cmd => cmd.category !== '👑 Owner').values()
        ]
    })
  })

  // Callback endpoint
  app.get(
    '/callback',
    passport.authenticate('discord', {
      failureRedirect: '/'
    }),
    (req, res) => {
      if (req.session.backURL) {
        const url = req.session.backURL
        req.session.backURL = null
        res.redirect(url)
      } else {
        res.redirect('/')
      }
    }
  )

  app.get('/api', function (req, res) {
    res.header('Content-Type', 'application/json')

    const obj = {
      guilds: client.guilds.cache.size,
      members: client.users.cache.size,
      roles: client.guilds.cache.size,
      channels: client.channels.cache.size,
      ping: client.ws.ping,
      uptime: client.uptime,
      ram: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
    }

    res.json(obj)
  })

  //status page
  app.get('/status', (req, res) => {
    render(res, req, 'other/status/status.ejs', {})
  })

  //logout
  app.get('/logout', function (req, res) {
    req.session.destroy(() => {
      req.logout()
      res.redirect('/')
    })
  })

  //contact
  app.get('/contact', (req, res) => {
    if (!req.user) req.session.backURL = '/contact'
    render(res, req, 'other/contact/contact.ejs', {
      alert: null
    })
  })

  //Embed Builder
  app.get('/embed-builder', (req, res) => {
    if (!req.user) req.session.backURL = '/embed-builder'
    render(res, req, 'other/embed-builder/embed-builder.ejs', {
      alert: null
    })
  })

  //contact post
  app.post('/contact', checkAuth, (req, res) => {
    if (contactCooldown.has(req.user.id)) {
      return render(res, req, 'other/error/error.ejs', {
        error: 'You recently contacted us. Please wait a little and try again.'
      })
    }
    // Styling of the Embed being sent <username/id> + <message>
    const contact = new Discord.MessageEmbed()
      .setColor('RANDOM')
      .setTitle(`📬 Contact Form`)
      .setDescription(`Someone just send a message to us!`)
      .addField(
        `👥 User`,
        `${req.user.username || 'Unknown'}/<@${req.user.id}> (ID: \`${req.user
          .id || 'Unknown'}\`)`
      )
      .addField(
        '📝 Message',
        `\`\`\`${req.body.message.substr(0, 2000) || 'None'}\`\`\``
      )
      .setTimestamp()

    //fill contact webhook here

    client.stafflogs.send({
      username: 'Contact',
      embeds: [contact],
  });

    // Cooldown for sending messages trough the panel.
    contactCooldown.add(req.user.id)
    setTimeout(() => {
      contactCooldown.delete(req.user.id)
    }, 60000)
    render(res, req, 'other/contact/contact.ejs', {
      alert: true
    })
  })

  app.get('/farm', checkAuth, async (req, res) => {
    let user = client.userSettings.get(req.user.id)
    let cron = require('node-cron');
    if (!user) {
      const findUser = await User.findOne({ Id: req.user.id })
      if (!findUser) {
        cron = require('node-cron');
        const newUser = await User.create({ Id: req.user.id })
        client.userSettings.set(req.user.id, newUser)
        user = newUser
      }
    }

    render(res, req, 'dashboard/dashboard/farm/farm.ejs', {
      settings: user, 
      cron: cron
    })
  })

  app.post('/farm', checkAuth, limit, async (req, res) => {
    let user = await User.findOne({ Id: req.user.id })
    let cron = require('node-cron');
    if (!user) {
      cron = require('node-cron');
      user = await User.create({ Id: req.user.id })
      client.userSettings.set(req.user.id, user)
    }
  })

  //main page
  app.get('/', (req, res) => {
    render(res, req, 'index.ejs')
  })

  //404 page
  app.use(function (req, res, next) {
    res.status(404)
    render(res, req, 'other/404/404.ejs')
  })

  //error page
  app.use((error, req, res, next) => {
    console.warn(error.stack)
    res.status(500)
    render(res, req, 'other/500/500.ejs')
  })

  app.post("/dblwebhook", async vote => {
    let UserProfile = await User.findOne({ Id: vote.user })

    if (!UserProfile) {
      const newUser = await User.create({ Id: vote.user })
      client.userSettings.set(vote.user, newUser)
      UserProfile = newUser
    }

    const vote_number = User.vote.votes + 1 || 1;

    const embed = new Discord.MessageEmbed()
    .setDescription(`Received a vote for <@${vote.bot}> \`${vote.bot}\` from <@${vote.user}> \`${vote.user}\` with **${vote_number}** votes.\n\nVote for me here: [top.gg/bot/673952206663319563](https://top.gg/bot/673952206663319563)`)
    .setColor('#6A0989');

      client.stafflogs.send({
        username: 'Vote Tracker',
        embeds: [embed],
    });
    
      User.vote.votes = vote_number;
      User.vote.lastVoted = Date.now()

      return await UserProfile.save()
  })

  // Setting the port online (from the config || default is 5000)
  app.listen(port, null, null, () =>
    console.log('WEBSITE ONLINE AT PORT ' + port)
  )
}
