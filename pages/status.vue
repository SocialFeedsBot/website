<template>
  <div>
    <div class="center p-5">
      <h1>Status (beta)</h1>
      <h6>Monitor the status of DiscordFeeds services. Refreshes every 5 seconds.</h6>
    </div>

    <div class="center">
      <b-container class="bv-example-row">
        <div class="statusbox">
          <h4>This status page is no longer operational.</h4>
          <p>We plan to bring the status page back soon.</p>
        </div><br>
        <b-row>
          <b-col>
            <h5>Bot</h5><h5 :style="{ color: colours[status.bot] }">
              <strong>• {{ status.bot.charAt(0).toUpperCase() + status.bot.substring(1).replace('_', ' ') }}</strong>
            </h5>
          </b-col>
          <b-col>
            <h5>Website</h5><h5 :style="{ color: colours[status.website] }">
              <strong>• {{ status.website.charAt(0).toUpperCase() + status.website.substring(1).replace('_', ' ') }}</strong>
            </h5>
          </b-col>
          <b-col>
            <h5>Feed Handler</h5><h5 :style="{ color: colours[status.feedHandler] }">
              <strong>• {{ status.feedHandler.charAt(0).toUpperCase() + status.feedHandler.substring(1).replace('_', ' ') }}</strong>
            </h5>
          </b-col>
          <b-col>
            <h5>API</h5><h5 :style="{ color: colours[status.api] }">
              <strong>• {{ status.api.charAt(0).toUpperCase() + status.api.substring(1).replace('_', ' ') }}</strong>
            </h5>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<style>
.center {
  width: 100%;
  text-align: center;
}

.statusbox {
  border-radius: 3px;
  border: 1px solid #ff2121;
  background: #ff212117;
  margin: 12px 0;
  padding: 12px;
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
        bot: 'unknown',
        website: 'operational',
        feedHandler: 'unknown',
        api: 'unknown'
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
    setInterval(() => this.updateStatus(), 5000)
  },

  methods: {
    async updateStatus () {
      const { body } = await superagent.get(`${window.location.origin}/stats`)

      if (!body.api || !body.feedHandler || !body.bot) { return }

      if ((Date.now() - body.api.lastUpdated) / 1000 > 5) {
        this.status.api = 'major_outage'
        this.api = false
      } else {
        this.status.api = 'operational'
        this.api = true
      }

      if ((Date.now() - body.feedHandler.lastUpdated) / 1000 > 5) {
        this.status.feedHandler = 'major_outage'
      } else if (!this.api) {
        this.status.feedHandler = 'partial_outage'
      } else {
        this.status.feedHandler = 'operational'
      }

      this.shards = body.bot.shards
      if ((Date.now() - body.bot.lastUpdated) / 1000 > 5) {
        this.status.bot = 'major_outage'
      } else if (!this.api) {
        this.status.bot = 'partial_outage'
      } else if (this.shards.filter(s => s.status !== 'ready').length > 0 && this.shards.filter(s => s.status !== 'ready').length < this.shards.length) {
        this.status.bot = 'partial_outage'
      } else if (this.shards.filter(s => s.status !== 'ready').length === this.shards.length) {
        this.status.bot = 'major_outage'
      } else {
        this.status.bot = 'operational'
      }
    }
  }
}
</script>
