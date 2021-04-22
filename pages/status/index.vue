<template>
  <div>
    <br>
    <div class="center mb-4">
      <h1>Status</h1>
      <p1>Monitor the status of SocialFeeds services.</p1>
    </div>

    <div class="container">
      <div :class="{ green: messagebox.status === 'ok', amber: messagebox.status === 'warn', red: messagebox.status === 'critical' }" class="status-message mt-4 mb-5 p-2">
        <h4>{{ messagebox.title }}</h4>
        <p>{{ messagebox.body }}</p>
      </div>

      <div class="row row-cols-4">
        <div v-for="service in services" :key="service.name + service.id || 'uk'" class="col">
          <b-card
            style="height: 12rem; width: 15rem;"
            class="mb-4 d-inline-block mr-4 mt-0"
          >
            <b-card-title style="text-align: left; font-size: 20px">
              <div class="mr-2 status-indicator" :class="{ green: service.status === 'ready', amber: service.status === 'resuming', red: service.status === 'disconnected' }" /> {{ service.name }}
            </b-card-title>
            <b-card-text style="text-align: left; font-weight: 100; line-height: 25px">
              Status: {{ service.status }}<br>
              <span v-if="service.uptime">Uptime: {{ service.uptime }}</span><br>
              <span v-if="service.memory">Memory: {{ service.memory }}</span><br>
              <span v-if="service.guilds !== undefined">Servers: {{ service.guilds.toLocaleString() }} (shards {{ service.shards }})<br></span>
            </b-card-text>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

  data () {
    return {
      services: [],
      messagebox: {
        status: 'ok',
        title: '',
        body: ''
      }
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
      const { data: services } = await this.$axios.get('/status/')
      const { data: outageMessage } = await this.$axios.get('/status/messages')
      this.services = []

      services.clusters.sort((a, b) => a.clusterID - b.clusterID).forEach((cluster) => {
        let status = 'ready'
        if (cluster.shards.filter(s => s.status !== 'ready').length > 0) {
          status = 'resuming'
        } else if (cluster.uptime < 10000) {
          status = 'resuming'
        }

        this.services.push({
          name: `Cluster ${cluster.clusterID}`,
          status,
          uptime: this.formatUptime(cluster.uptime / 60000),
          memory: this.formatMemory(cluster.memory),
          guilds: cluster.guilds,
          shards: cluster.shards.map(s => s.id).sort((a, b) => a - b).join(', ')
        })
      })

      services.interactions.sort((a, b) => a.interactionsID - b.interactionsID).forEach((interactions) => {
        this.services.push({
          name: `Interactions ${interactions.interactionsID}`,
          status: interactions.uptime < 10000 ? 'resuming' : 'ready',
          uptime: this.formatUptime(interactions.uptime / 60000),
          memory: this.formatMemory(interactions.memory)
        })
      })

      this.services.push({
        name: 'API',
        status: services.api ? (services.api.uptime < 10000 ? 'resuming' : 'ready') : 'disconnected',
        uptime: services.api ? this.formatUptime(services.api.uptime / 60000) : undefined,
        memory: services.api ? this.formatMemory(services.api.memory) : undefined
      })

      this.services.push({
        name: 'Feed Handler',
        status: services.feeds ? (services.feeds.uptime < 10000 ? 'resuming' : 'ready') : 'disconnected',
        uptime: services.feeds ? this.formatUptime(services.feeds.uptime / 60000) : undefined,
        memory: services.feeds ? this.formatMemory(services.feeds.memory) : undefined
      })

      if (outageMessage.status !== 'ok') {
        this.messagebox.title = outageMessage.head
        this.messagebox.body = outageMessage.body
        this.messagebox.status = outageMessage.status
      } else {
        this.messagebox.title = 'All services operational'
        this.messagebox.body = 'No issues have been reported, please go to our support server if you are encountering any issues.'
        this.messagebox.status = 'ok'
      }
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
    border-radius: 10px;
    border: 0px;
    height: 20px;
    width: 20px;
    float: left;
  }
  .status-indicator.green { background-color: #81e968; }
  .status-indicator.amber { background-color: #e9a668; }
  .status-indicator.red { background-color: rgb(233, 104, 104); }

  .status-message {
    border-radius: 5px;
    width: 100%;
    height: 100px;
  }
  .status-message.green { border: 1px solid #81e968; background-color: rgb(129, 233, 104, 0.04) }
  .status-message.amber { border: 1px solid #e9a668; background-color: rgb(233, 166, 104, 0.04) }
  .status-message.red { border: 1px solid rgb(233, 104, 104); background-color: rgb(233, 104, 104, 0.04) }

</style>
