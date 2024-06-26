<template>
  <div>
    <br>
    <div class="center mb-4">
      <h1>Status</h1>
      <p1>Monitor the status of SocialFeeds services.</p1>
    </div>

    <div v-if="ready === false">
      <div style="text-align: center;">
        <img src="@/assets/loading.gif" width="100px" height="100px" alt="loading">
      </div>
    </div>

    <div v-if="ready" class="container">
      <div :class="{ green: messageBox.status === 'ok', amber: messageBox.status === 'warn', red: messageBox.status === 'major' }" class="alert-box mt-4 mb-5 p-2">
        <h4>{{ messageBox.head }}</h4>
        {{ messageBox.body }}
      </div>

      <b-row>
        <div v-for="service in Object.values(services).flat()" :key="service.name + service.id || 'uk'" class="cols-3 cols-sm-12">
          <b-card
            style="height: 12rem; width: 15rem;"
            class="block mb-4 mr-4"
          >
            <b-card-title style="text-align: left; font-size: 20px">
              <div class="mr-2 status-indicator" :class="{ green: service.status === 'ready', amber: service.status === 'resuming', red: service.status === 'disconnected' }" /> {{ service.name }}
            </b-card-title>
            <b-card-text style="text-align: left; font-weight: 100; line-height: 25px">
              Status: {{ service.status }}<br>
              <span v-if="service.uptime">Uptime: {{ formatUptime(service.uptime) }}</span><br>
              <span v-if="service.memory">Memory: {{ formatMemory(service.memory) }}</span><br>
              <span v-if="service.guilds !== undefined">Servers: {{ service.guilds.toLocaleString() }}<br></span>
            </b-card-text>
          </b-card>
        </div>
      </b-row>
    </div>
  </div>
</template>

<script>
export default {

  data: () => ({
    ready: false
  }),

  computed: {
    services () {
      return this.$store.getters['stats/allServices']
    },

    messageBox () {
      return this.$store.getters['stats/outageMessage']
    }
  },

  mounted () {
    this.update()
    this.interval = setInterval(() => this.update(), 4000)
  },

  beforeDestroy () {
    clearInterval(this.interval)
  },

  methods: {
    async update () {
      await this.$store.dispatch('stats/GET_STATUS')
      await this.$store.dispatch('stats/GET_STATUS_MESSAGE')
      this.ready = true
    },

    formatMemory (bytes) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      if (bytes === 0) { return 'n/a' }
      const by = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
      if (by === 0) { return `${bytes} ${sizes[by]}` }
      return `${(bytes / 1024 ** by).toFixed(1)} ${sizes[by]}`
    },
    formatUptime (i) {
      const d = Math.floor(i / (24 * 60))
      const h = Math.floor((i / 60) - (24 * d))
      const m = Math.round(i - 60 * (24 * d + h))
      let result = ''
      // days
      if (d > 0) {
        result = result + `${d}d`
      }
      // hours
      if (h > 0) {
        if (result !== '') {
          result = result + ' '
        }
        result = result + `${h}h`
      }
      // minutes
      if (m > 0) {
        if (result !== '') {
          result = result + ' '
        }
        result = result + `${m}m`
      }
      return result === '' ? '<1m' : result
    }
  }

}
</script>

<style scoped>

  .status-indicator {
    border-radius: 12px;
    border: 0px;
    height: 18px;
    width: 18px;
    float: left;
  }
  .status-indicator.green { background-color: #81e968; }
  .status-indicator.amber { background-color: #e9a668; }
  .status-indicator.red { background-color: rgb(233, 104, 104); }

</style>
