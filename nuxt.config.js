const config = require('./config')

module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: 'SocialFeeds',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'SocialFeeds is a Discord bot with a web dashboard to automatically post new items from a RSS/twitter/twitch feed.' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;800&display=swap' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#ffffff', throttle: 0 },
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/axios',
    '~/plugins/fontawesome'
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
    '@nuxtjs/axios',
    '@nuxtjs/style-resources'
  ],

  css: [
    '@fortawesome/fontawesome-svg-core/styles.css',
    { src: '@/assets/css/main.css' }
  ],

  fontawesome: {
    component: 'fa',
    icons: {
      solid: true,
      brands: true
    }
  },
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
