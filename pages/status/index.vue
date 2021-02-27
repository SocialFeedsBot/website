<template>
  <div class="center">
    <div class="pb-3 pt-4 mt-4 mb-5">
      <b-container id="statusbox" class="bv-example-row pt-4">
        <div class="d-block">
          <h3>Status</h3><br>
        </div>

        <div v-for="(w) in status.shards" :key="w" class="d-inline-block mx-1 my-1">
          <div v-b-tooltip.hover :title="w.status" class="d-flex align-items-center" :class="{ status: true, statusok: w.status === 'ready', statusamber: w.status !== 'ready', statusred: w.status === 'disconnected' }">
            {{ w.id }}
          </div>
        </div><br><br>

        <div>
          <h4 class="mt-4 pt-4 pb-2">
            Background Services
          </h4>
          <div class="d-inline-block mx-1 my-1">
            <div v-b-tooltip.hover :title="status.api && (status.api.uptime / 1000) > 60 ? `Uptime: ${formatUptime(status.api ? status.api.uptime / 1000 / 60 : 0) } | Memory: ${formatMemory(status.api ? status.api.memory : 0)}` : 'Starting'" class="d-flex align-items-center" :class="{ status: true, statusamber: status.api && status.api.uptime / 1000 < 60, statusok: status.api, statusred: !status.api }">
              API
            </div>
          </div>

          <div class="d-inline-block mx-1 my-1">
            <div v-b-tooltip.hover :title="status.feeds && (status.feeds.uptime / 1000) > 60 ? `Uptime: ${formatUptime(status.feeds ? status.feeds.uptime / 1000 / 60 : 0) } | Memory: ${formatMemory(status.feeds ? status.feeds.memory : 0)}` : 'Starting'" class="d-flex align-items-center" :class="{ status: true, statusamber: feeds && status.feeds.uptime / 1000 < 60, statusok: status.status.feeds && status.feeds.uptime > 0, statusred: !status.feeds || status.feeds.uptime === 0 }">
              Feed Handler
            </div>
          </div>
        </div>
      </b-container>
    </div>
  </div>
</template>

<style>
.center {
  width: 100%;
  text-align: center;
}

.status {
  border-radius: .25rem;
  margin: 0.25rem;
  padding: 12px;
  font-weight: 500;
  font-size: 20px;
  -webkit-text-stroke: 0.1px black;
  display: flex;
  height: 40px;
  width: inherit;
}

.statusok {
  border: 1px solid #4cc767;
}
.statusamber {
  border: 1px solid #ff6721;
}

.statusred {
  border: 1px solid #ff2121;
}
#statusbox  {
  background-color: #23272A;
  border-radius: 5px;
}

</style>

<script>
export default {
  data () {
    return {
      shards: [],
      api: false,
      status: {
        shards: [],
        clusters: [],
        feeds: null,
        api: null
      },
      colours: {
        unknown: '#969696',
        partial_outage: '#ffae00',
        major_outage: '#ff2f00',
        operational: '#55eb34'
      }
    }
  },

  beforeDestroy () {
    clearInterval(this.interval)
  },

  async mounted () {
    await this.updateStatus()
    this.interval = setInterval(() => this.updateStatus(), 10 * 1000)
  },

  methods: {
    async updateStatus () {
      try {
        const { data } = await this.$axios.get('/status')
        this.status.shards = data.shards.sort((a, b) => a.id - b.id)
        this.status.api = data.api
        this.status.feeds = data.feeds[0]
      } catch (e) {
        this.status.api = null
        this.status.feeds = null
        this.status.shards = []
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

      return result
    }
  }
}
</script>
