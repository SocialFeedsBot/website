export const state = () => ({
  user: null,
  guilds: []
})

export const mutations = {

  SET_USER (state, user) {
    state.user = user
  },

  SET_USER_GUILDS (state, guilds) {
    state.guilds = guilds
  },

  SET_TOKEN (state, token) {
    if (!state.user) {
      state.user = {}
    }
    state.user.token = token
  }

}

export const actions = {

  GET_USER ({ commit }) {
    commit('SET_USER', {})
    return this.$axios.get('/users/@me').then(({ data }) => {
      commit('SET_USER', data)
    }).catch((err) => {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token')
        commit('SET_USER', null)
        commit('SET_USER_GUILDS', [])
      }
    })
  },

  GET_USER_GUILDS ({ commit }) {
    commit('SET_USER_GUILDS', [])
    return this.$axios.get('/guilds/@me').then(({ data }) => {
      commit('SET_USER_GUILDS', data)
    }).catch((err) => {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token')
        commit('SET_USER', null)
        commit('SET_USER_GUILDS', [])
      }
    })
  }

}

export const getters = {

  user: (state) => {
    return state.user
  },

  manageableGuilds: (state) => {
    return state.guilds ? state.guilds.filter(g => BigInt(g.permissions) & 1n << 3n || BigInt(g.permissions) & 1n << 5n) : []
  },

  allGuilds: (state) => {
    return state.guilds || []
  }

}
