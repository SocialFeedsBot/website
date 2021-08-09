const EventEmitter = require('events')
const config = require('../public_config.json')

export default function ({ store }, inject) {
  if (!process.client) {
    return
  }

  const ws = new WS()
  ws.on('event', async (type, data) => {
    if (!data.guildID === store.state.guild.guild.id) {
      return
    }

    const feeds = JSON.parse(JSON.stringify(store.state.feeds.feeds))

    switch (type) {
      case 'FEED_CREATE': {
        if (feeds[data.channelID]) {
          feeds[data.channelID].push(data)
        } else {
          feeds[data.channelID] = [data]
        }
        break
      }

      case 'FEED_DELETE': {
        Object.values(feeds).forEach((channel, key) => {
          feeds[key] = channel.filter((feed) => {
            if (feed.url === data.url && feed.type === data.type && feed.webhookID === data.webhook_id) {
              return null
            } else {
              return feed
            }
          }).filter(f => f)
        })
        break
      }

      case 'FEED_UPDATE': {
        Object.values(feeds).forEach((channel, key) => {
          feeds[key] = channel.filter((feed) => {
            if (feed.url === data.url && feed.type === data.type && feed.webhookID === data.webhook_id) {
              return data
            } else {
              return feed
            }
          }).filter(f => f)
        })
        break
      }

      default:
        break
    }

    await store.commit('feeds/SET_FEEDS', feeds)
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
