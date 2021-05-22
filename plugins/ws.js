const EventEmitter = require('events')
const config = require('../public_config.json')

export default function ({ store }, inject) {
  if (!process.client) {
    return
  }

  const ws = new WS()
  ws.on('event', (type, data) => {
    if (type === 'FEED_UPDATE' && data.guildID === store.state.guild.guild.id) {
      const orderedFeeds = {}
      store.getters['guild/channels'].forEach((channel) => {
        const channelFeeds = data.feeds.filter(doc => doc.channelID === channel.id)
        if (channelFeeds.length > 0) {
          orderedFeeds[channel.id] = channelFeeds
        }
      })

      store.commit('feeds/SET_FEEDS_COUNT', data.feeds.length)
      store.commit('feeds/SET_FEEDS', orderedFeeds)
    }
  })

  if (localStorage.token) {
    ws.connect()
  }

  inject('ws', ws)
}

class WS extends EventEmitter {
  constructor () {
    super()
    this.connection = null
    this.shouldReconnect = true
  }

  connect () {
    if (this.connection) {
      return
    }
    this.shouldReconnect = true

    this.connection = new WebSocket(config.websocketURL)
    this.connection.onclose = () => {
      if (this.shouldReconnect) {
        setTimeout(() => this.connect(), 1000)
      }
    }
    this.connection.onmessage = msg => this.onMessage(msg)
  }

  disconnect () {
    if (!this.connection) {
      return null
    }

    this.shouldReconnect = false
    this.connection.close(4002)
    this.connection = null
  }

  send (op, data = {}, extra = {}) {
    this.connection.send(JSON.stringify({ op, data, ...extra }))
  }

  onMessage (msg) {
    msg = JSON.parse(msg.data)

    switch (msg.op) {
      case this.OPCodes.IDENTIFY: {
        this.send(this.OPCodes.IDENTIFY, {
          token: localStorage.token
        })
        break
      }

      case this.OPCodes.EVENT: {
        this.emit('event', msg.t, msg.data)
        break
      }
    }
  }

  get OPCodes () {
    return {
      IDENTIFY: 0,
      READY: 1,
      EVENT: 2
    }
  }
}
