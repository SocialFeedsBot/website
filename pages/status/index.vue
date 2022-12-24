<template>
  <main>
    <div v-if="ready === false">
      <div class="loader">
        <img src="@/assets/loading.gif" alt="loading">
      </div>
    </div>

    <div v-if="ready" class="container">
      <h2>{{ messageBox.head }}</h2>
      <p v-if="messageBox.status !== 'ok'" :class="{ 'text-green': messageBox.status === 'ok', 'text-amber': messageBox.status === 'warn', 'text-red': messageBox.status === 'major' }">
        {{ messageBox.body }}
      </p>

      <div class="grid grid-cols-4">
        <div v-for="service in Object.values(services).flat()" :key="service.name + service.id || 'uk'">
          <StatusCard class="" :service="service" />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import StatusCard from '@/components/StatusCard.vue'
export default {
  components: { StatusCard },

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
    this.interval = setInterval(() => this.update(), 2500)
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

<style lang="scss" scoped>
@import "@/assets/css/_variables.scss";
h2 {
  margin: 3rem 1rem 1rem 1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 400px);
  grid-gap: .5rem;
}

.text-green { color: #81e968; }

.text-amber { color: #e9a668; }
.text-red { color: rgb(233, 104, 104); }

.status-indicator {
  border-radius: 12px;
  border: 0px;
  height: 18px;
  width: 18px;
  float: left;
}

.status-indicator.green {
  background-color: #81e968;
}

.status-indicator.amber {
  background-color: #e9a668;
}

.status-indicator.red {
  background-color: #e96868;
}

.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20vh;
  height: 100%;
}

img {
  width: 100px;
  height: 100px;
  margin: auto;
}
</style>
