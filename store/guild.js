export const state = () => ({
  guild: {},
  channels: []
})

export const mutations = {

  SET_GUILD (state, guild) {
    state.guild = guild
  },

  SET_GUILD_CHANNELS (state, channels) {
    state.channels = channels
  },

  RESET (state) {
    state.guild = {}
    state.channels = []
  }

}

export const actions = {

  GET_GUILD ({ commit }, guildID) {
    commit('SET_GUILD', {})
    commit('SET_GUILD_CHANNELS', [])
    return this.$axios.get(`/guilds/${guildID}`).then(async ({ data: guild }) => {
      const channels = (await this.$axios.get(`/guilds/${guildID}/channels`)).data

      commit('SET_GUILD', guild)
      commit('SET_GUILD_CHANNELS', Object.values(channels).sort((a, b) => a.position - b.position))
      return true
    }).catch((err) => {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token')
        commit('SET_USER', null)
        commit('SET_USER_GUILDS', [])
        return false
      }
    })
  },

  RESET ({ commit }) {
    commit('RESET')
  }

}

export const getters = {

  guild: (state) => {
    return state.guild
  },

  channels: (state) => {
    return state.channels
  }

}
