<template>
  <div>
    <br>
    <div class="center mb-4">
      <h1>Status</h1>
      <p1>Monitor the status of SocialFeeds services.</p1>
    </div>

    <div class="container">
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
              Uptime: {{ service.uptime }}<br>
              Memory: {{ service.memory }}<br>
              <span v-if="service.guilds">Servers: {{ service.guilds.toLocaleString() }}<br></span>
              <span v-if="service.cluster">Cluster: {{ service.cluster }}<br></span><br>
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
      services: []
    }
  },

  mounted () {
    this.update()
    this.interval = setInterval(() => this.update(), 5000)
  },

  beforeDestroy () {
    clearInterval(this.interval)
  },

  methods: {
    async update () {
      const { data: services } = await this.$axios.get('/status/')
      this.services = []

      Object.keys(services).forEach((serviceKey) => {
        let newServiceKey = serviceKey.charAt(0).toUpperCase() + serviceKey.substring(1)
        if (serviceKey === 'api') { newServiceKey = 'API' }

        if (Array.isArray(services[serviceKey])) {
          services[serviceKey].forEach((service) => {
            let status
            if (service.status) {
              status = service.status
            } else {
              status = service.uptime > 10 ? 'ready' : 'resuming'
            }
            this.services.push({
              name: `${newServiceKey === 'Shards' ? 'Shard' : newServiceKey}${service.id !== undefined ? ` ${service.id}` : ''}`,
              uptime: this.formatUptime(service.uptime / 60000),
              memory: this.formatMemory(service.memory),
              status,
              guilds: service.guilds,
              cluster: service.cluster
            })
          })
        } else {
          this.services.push({
            name: `${newServiceKey}${services[serviceKey].id ? ` ${services[serviceKey].id}` : ''}`,
            uptime: this.formatUptime(services[serviceKey].uptime / 60000),
            memory: this.formatMemory(services[serviceKey].memory),
            status: services[serviceKey].uptime > 10 ? 'ready' : 'resuming'
          })
        }
      })
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

</style>
