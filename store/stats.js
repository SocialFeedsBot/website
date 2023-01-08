export const state = () => ({
  guildCount: 0,
  outageMessage: { title: '', body: '', status: '' },
  shards: [],
  interactions: [],
  apis: [],
  feeds: []
})

export const mutations = {

  SET_GUILD_COUNT (state, count) {
    state.guildCount = count
  },

  SET_STATUS_MESSAGE (state, message) {
    state.outageMessage = message
  },

  SET_SHARDS (state, shards) {
    state.shards = shards
  },

  SET_INTERACTIONS (state, interactions) {
    state.interactions = interactions
  },

  SET_APIS (state, apis) {
    state.apis = apis
  },

  SET_FEEDS (state, feeds) {
    state.feeds = feeds
  }

}

export const actions = {

  GET_GUILD_COUNT ({ commit }) {
    this.$axios.get('/status/').then(({ data }) => {
      commit('SET_GUILD_COUNT', data.shards.reduce((a, b) => a + b.guilds, 0))
    }).catch((e) => { /* ignore */ })
  },

  GET_STATUS ({ commit }) {
    this.$axios.get('/status/').then(({ data: services }) => {
      commit('SET_SHARDS', services.shards.sort((a, b) => a.id - b.id).map((sharder) => {
        let status = 'ready'
        if (sharder.status === 'disconnected') {
          status = 'disconnected'
        } else if (sharder.uptime < 10000) {
          status = 'resuming'
        }

        return {
          name: `Shards ${sharder.id}`,
          status,
          uptime: sharder.uptime / 60000,
          memory: sharder.memory,
          guilds: sharder.guilds,
          shards: (sharder.shards || []).map(s => s.id).sort((a, b) => a - b).join(', ')
        }
      }))

      commit('SET_INTERACTIONS', services.interactions.sort((a, b) => a.id - b.id).map(interactions => ({
        name: `Interactions ${interactions.id}`,
        status: interactions.status === 'disconnected' ? 'disconnected' : (interactions.uptime < 10000 ? 'resuming' : 'ready'),
        uptime: interactions.uptime / 60000,
        memory: interactions.memory
      })))

      commit('SET_APIS', services.apis.sort((a, b) => a.id - b.id).map(api => ({
        name: `API ${api.id}`,
        status: api.status === 'disconnected' ? 'disconnected' : (api.uptime < 10000 ? 'resuming' : 'ready'),
        uptime: api.uptime / 60000,
        memory: api.memory
      })))

      commit('SET_FEEDS', services.feeds.sort((a, b) => tonumber(a.id.split('-')[1]) - tonumber(b.id.split('-')[1])).map(feeds => ({
        name: `Feeds ${feeds.id}`,
        status: feeds.status === 'disconnected' ? 'disconnected' : (feeds.uptime < 10000 ? 'resuming' : 'ready'),
        uptime: feeds.uptime / 60000,
        memory: feeds.memory
      })))
    })
  },

  GET_STATUS_MESSAGE ({ commit }) {
    this.$axios.get('/status/messages').then(({ data: outageMessage }) => {
      if (outageMessage.outage !== false && outageMessage.status !== 'ok') {
        commit('SET_STATUS_MESSAGE', outageMessage)
      } else {
        commit('SET_STATUS_MESSAGE', {
          head: 'All services operational',
          body: 'No issues have been reported, please go to our support server if you are encountering any issues.',
          status: 'ok'
        })
      }
    })
  }

}

export const getters = {

  guildCount (state) {
    return state.guildCount
  },

  outageMessage (state) {
    return state.outageMessage
  },

  allServices (state) {
    return {
      shards: state.shards,
      interactions: state.interactions,
      apis: state.apis,
      feeds: state.feeds
    }
  }

}
