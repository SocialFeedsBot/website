export const state = () => ({
  user: null,
  state: 'NOTHING',
  guilds: []
})

export const mutations = {

  SET_USER (state, user) {
    state.user = user
  },

  SET_STATE (state, newState) {
    state.state = newState
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
    commit('SET_STATE', 'LOADING')
    return this.$axios.get('/users/@me').then(({ data }) => {
      commit('SET_USER', data)
      commit('SET_STATE', 'DONE')
    }).catch((err) => {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token')
        commit('SET_USER', null)
        commit('SET_USER_GUILDS', [])
        commit('SET_STATE', 'NOTHING')
      }
    })
  },

  GET_USER_GUILDS ({ commit }) {
    commit('SET_USER_GUILDS', [])
    commit('SET_STATE', 'LOADING')
    return this.$axios.get('/guilds/@me').then(({ data }) => {
      commit('SET_USER_GUILDS', data)
      commit('SET_STATE', 'DONE')
    }).catch((err) => {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token')
        commit('SET_USER', null)
        commit('SET_USER_GUILDS', [])
        commit('SET_STATE', 'NOTHING')
      }
    })
  }

}

export const getters = {

  user: (state) => {
    return state.user
  },

  state: (state) => {
    return state.state
  },

  manageableGuilds: (state) => {
    return state.guilds ? state.guilds.filter(g => BigInt(g.permissions) & 1n << 3n || BigInt(g.permissions) & 1n << 5n) : []
  },

  allGuilds: (state) => {
    return state.guilds || []
  }

}
