export default function ({ $axios, store }) {
  $axios.onRequest((config) => {
    if (process.client && !config.headers.Authorization) {
      const user = store.getters.user
      config.headers.Authorization = (user && user.token) || localStorage.getItem('token')
    }
  })
}
