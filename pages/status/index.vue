<template>
  <div class="center">
    <div class="pb-3 pt-4 mt-4 mb-5">
      <b-container id="statusbox" class="bv-example-row pt-4">
        <div class="d-block">
          <h3>Status</h3><br>
        </div>

        <div v-for="(w) in status.shards.sort((a,b) => a.id - b.id)" :key="w" class="d-inline-block mx-1 my-1">
          <div v-b-tooltip.hover :title="w.status" class="d-flex align-items-center" :class="{ status: true, statusok: w.status === 'ready', statusamber: w.status !== 'ready', statusred: w.status === 'disconnected' }">
            {{ w.id }}
          </div>
        </div><br><br>

        <div>
          <h4 class="mt-4 pt-4 pb-2">
            Background Services
          </h4>
          <div class="d-inline-block mx-1 my-1">
            <div v-b-tooltip.hover title="Adds/removes feeds and gives the feed handler data." class="d-flex align-items-center" :class="{ status: true, statusok: status.api, statusred: !status.api }">
              API
            </div>
          </div>

          <div class="d-inline-block mx-1 my-1">
            <div v-b-tooltip.hover title="Handles posting feeds to your server." class="d-flex align-items-center" :class="{ status: true, statusok: status.feeds && status.feeds.uptime > 0, statusred: !status.feeds || status.feeds.uptime === 0 }">
              Feed Handler
            </div>
          </div>
        </div>

        <br>

        <!--
        <b-row>
          <b-col>
            <h5>API</h5><h5 :style="{ color: colours[status.api ? 'operational' : 'major_outage'] }">
              <strong>{{ status.api ? 'Operational' : 'Major Outage' }}</strong>
            </h5>
          </b-col>
          <b-col>
            <h5>Feed Handler</h5><h5 :style="{ color: colours[status.feeds && status.feeds.uptime > 0 ? 'operational' : 'major_outage'] }">
              <strong>{{ status.feeds && status.feeds.uptime > 0 ? 'Operational' : 'Offline' }}</strong>
            </h5>
          </b-col>
        </b-row> -->
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
        this.status.shards = data.shards
        this.status.api = data.api
        this.status.feeds = data.feeds
      } catch (e) {
        this.status.api = null
        this.status.feeds = null
        this.status.shards = []
      }
    }
  }
}
</script>
