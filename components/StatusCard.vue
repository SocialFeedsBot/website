<template>
  <div class="card">
    <div class="content">
      <div class="heading">
        <h2 class="title">
          {{ type }}
          <h4>{{ id }}</h4>
        </h2>
        <div class="status">
          <div v-if="service.status" class="stat">
            <p class="value" :class="statusColour">
              {{ statusWord }}
            </p>
          </div>
        </div>
      </div>

      <div class="stats">
        <div v-if="service.uptime" class="stat">
          <div class="key">
            Uptime
          </div>
          <p class="value">
            {{ formatUptime(service.uptime) }}
          </p>
        </div>
        <div v-if="service.memory" class="stat">
          <div class="key">
            Memory
          </div>
          <p class="value">
            {{ formatMemory(service.memory) }}
          </p>
        </div>
        <div v-if="service.guilds !== undefined" class="stat">
          <div class="key">
            Servers
          </div>
          <p class="value">
            {{ service.guilds.toLocaleString() }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['service'],

  computed: {
    statusColour () {
      switch (this.service.status) {
        case 'ready':
          return 'green'
        case 'resuming':
          return 'amber'
        default:
          return 'red'
      }
    },
    statusWord () {
      switch (this.service.status) {
        case 'ready':
          return 'Healthy'
        case 'resuming':
          return 'Partial Outage'
        default:
          return 'Down'
      }
    },
    type () {
      return this.service.name.split(' ')[0].replace(/s$/, '')
    },
    id () {
      return this.service.name.split(' ')[1] || 'Service'
    }
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

.card {
  display: flex;
  flex-direction: row;
  background-color: $background-dark;
  border-radius: 1rem;
  min-height: 150px;
  margin: 1rem;

  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 1rem 1rem 1rem 0rem;
    align-content: space-around;
    justify-content: space-between;
    align-items: center;
  }

  .heading {
    width: 100%;
    margin: 0 1rem;
    align-self: flex-start;
    align-content: space-around;
    justify-content: space-between;
    display: flex;
    flex-direction: row;
  }

  h2 {
    margin: 0;
    align-self: left;
    font-family: $font-family-brand;
    font-size: 1.25rem;
    font-weight: 500;
    align-content: space-between;
  }

  h4 {
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
    color: #6e6e7a;
  }

  .stats {
    align-items: center;
    display: flex;
    flex-direction: row;
    align-self: flex-start;
  }

  .stat {
    display: block;
    // width: 90px;
    margin: 0 1rem;
  }

  .key {
    font-family: $font-family-brand;
    font-size: 0.9rem;
    font-weight: 500;
    margin: 0;
    margin-right: 0.5rem;
    color: #6e6e7a;
  }

  .value {
    font-family: $font-family-brand;
    font-size: 1rem;
    font-weight: 500;
    margin: 0;
  }

  .status {
    .green {
      color: #01FF70;
    }

    .amber {
      color: #FF851B;
    }

    .red {
      color: #FF4136;
    }
  }

}
</style>
