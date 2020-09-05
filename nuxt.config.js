const config = require('./config')

module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: 'DiscordFeeds',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'DiscordFeeds is a Discord bot with a web dashboard to automatically post new items from a RSS/twitter/twitch feed.' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '~/assets/logo.png' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#ffffff', throttle: 0 },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/axios'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    'nuxt-fontawesome',
    '@nuxtjs/axios'
  ],
  /*
  ** Axios Config
  */
  axios: config.axios,
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  },
  server: {
    port: config.port
  }
}
