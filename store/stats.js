export const state = () => ({
  guildCount: 0,
  outageMessage: { title: '', body: '', status: '' },
  clusters: [],
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

  SET_CLUSTERS (state, clusters) {
    state.clusters = clusters
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
      commit('SET_GUILD_COUNT', data.clusters.reduce((a, b) => a + b.guilds, 0))
    }).catch((e) => { /* ignore */ })
  },

  GET_STATUS ({ commit }) {
    this.$axios.get('/status/').then(({ data: services }) => {
      commit('SET_CLUSTERS', services.clusters.sort((a, b) => a.clusterID - b.clusterID).map((cluster) => {
        let status = 'ready'
        if (cluster.shards.filter(s => s.status !== 'ready').length > 0) {
          status = 'resuming'
        } else if (cluster.uptime < 10000) {
          status = 'resuming'
        }

        return {
          name: `Cluster ${cluster.clusterID}`,
          status,
          uptime: cluster.uptime / 60000,
          memory: cluster.memory,
          guilds: cluster.guilds,
          shards: cluster.shards.map(s => s.id).sort((a, b) => a - b).join(', ')
        }
      }))

      commit('SET_INTERACTIONS', services.interactions.sort((a, b) => a.interactionsID - b.interactionsID).map(interactions => ({
        name: `Interactions ${interactions.interactionsID}`,
        status: interactions.uptime < 10000 ? 'resuming' : 'ready',
        uptime: interactions.uptime / 60000,
        memory: interactions.memory
      })))

      commit('SET_APIS', services.apis.sort((a, b) => a.uptime - b.uptime).map(api => ({
        name: `API ${api.id}`,
        status: api.uptime < 10000 ? 'resuming' : 'ready',
        uptime: api.uptime / 60000,
        memory: api.memory
      })))

      commit('SET_FEEDS', services.feeds.sort((a, b) => a.uptime - b.uptime).map(feeds => ({
        name: `Feeds ${feeds.id}`,
        status: feeds.uptime < 10000 ? 'resuming' : 'ready',
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
          title: 'All services operational',
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
      cluster: state.clusters,
      interactions: state.interactions,
      apis: state.apis,
      feeds: state.feeds
    }
  }

}
