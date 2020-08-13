<template>
  <div>
    <div class="center p-5">
      <h1>Status</h1>
      <h6>Monitor the status of DiscordFeeds services. Refreshes every 5 seconds.</h6>
    </div>

    <div class="center">
      <b-container class="bv-example-row">
        <b-row>
          <b-col>
            <h5>API</h5><h5 :style="{ color: colours[status.api ? 'operational' : 'major_outage'] }">
              <strong>{{ status.api ? 'Operational' : 'Major Outage' }}</strong>
            </h5>
          </b-col>
          <b-col>
            <h5>Feed Handler</h5><h5 :style="{ color: colours[status.feeds && status.feeds.uptime > 0 ? 'operational' : 'unknown'] }">
              <strong>{{ status.feeds && status.feeds.uptime > 0 ? 'Operational' : 'Unknown' }}</strong>
            </h5>
          </b-col>
        </b-row>
      </b-container>
    </div>

    <b-container class="bv-example-row">
      <b-row>
        <b-col>
          <h4>Shards</h4>
          <div v-for="(w, index) in status.shards" :key="w">
            <div v-b-tooltip.hover v-bind:title="w.status.charAt(0).toUpperCase() + w.status.substring(1)" class="d-flex align-items-center" :class="{ status: true, statusok: w.status === 'ready', statusamber: w.status === 'resuming', statusred: w.status === 'disconnected' }">
              {{ index }}
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<style>
.center {
  width: 100%;
  text-align: center;
}

.status {
  border-radius: 3px;
  margin: 12px 0;
  padding: 12px;
  width: flex;
  height: 40px;
  float: left;
  font-weight: 500;
  font-size: 20px;
  -webkit-text-stroke: 0.1px black;
}

.statusok {
  border: 1px solid #009b22;
  background: #21ff513d;
}
.statusamber {
  border: 1px solid #ff6721;
  background: #ff672136;
}

.statusred {
  border: 1px solid #ff2121;
  background: #ff212117
}

</style>

<script>
import superagent from 'superagent'

export default {
  data () {
    return {
      shards: [],
      api: false,
      status: {
        shards: [],
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

  async mounted () {
    await this.updateStatus()
    setInterval(() => this.updateStatus(), 5 * 1000)
  },

  methods: {
    async updateStatus () {
      try {
        const { body } = await superagent.get(`http://localhost:3200/status`)
        this.status.shards = body.shards
        this.status.api = body.api
        this.status.feeds = body.feeds
      } catch (e) {
        this.status.api = null
        this.status.feeds = null
        this.status.shards = []
      }
    },

    parseUptime (ms) {
      return ms
    }
  }
}
</script>
