export const state = () => ({
  feeds: {},
  feedCount: 0,
  totalFeeds: 0
})

export const mutations = {

  SET_FEEDS (state, feeds) {
    state.feeds = feeds
  },

  SET_FEEDS_COUNT (state, count) {
    state.feedCount = count
  },

  SET_TOTAL_FEEDS_COUNT (state, count) {
    state.totalFeeds = count
  },

  RESET (state) {
    state.feeds = {}
    state.feedCount = 0
    state.totalFeeds = 0
  }

}

export const actions = {

  GET_FEEDS ({ rootGetters, commit }, guildID) {
    return this.$axios.get(`/feeds/${guildID || ''}`).then(async ({ data }) => {
      const feeds = []
      feeds.push(...data.feeds)

      for (let i = 1; i < data.pages; i++) {
        const d = (await this.$axios.get(`/feeds/${guildID || ''}?page=${i + 1}`)).data
        feeds.push(...d.feeds)
      }

      commit('SET_FEEDS_COUNT', feeds.length)

      const orderedFeeds = {}
      rootGetters['guild/channels'].forEach((channel) => {
        const channelFeeds = feeds.filter(doc => doc.channelID === channel.id)
        if (channelFeeds.length > 0) {
          orderedFeeds[channel.id] = channelFeeds
        }
      })

      commit('SET_FEEDS', orderedFeeds)
      return true
    }).catch((err) => {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token')
        commit('SET_USER', null)
        commit('SET_FEEDS', {})
        commit('SET_USER_GUILDS', [])
        return false
      }
    })
  },

  GET_TOTAL_FEEDS ({ commit }) {
    return this.$axios.get('/feeds/counts').then(({ data }) => {
      commit('SET_TOTAL_FEEDS_COUNT', data.feedCount)
    }).catch((e) => { /* ignore */ })
  },

  RESET ({ commit }) {
    commit('RESET')
  }

}

export const getters = {

  feeds: (state) => {
    return state.feeds
  },

  count: (state) => {
    return state.feedCount
  },

  totalFeeds: (state) => {
    return state.totalFeeds
  }

}
