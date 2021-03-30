<template>
  <b-container fluid class="mt-4 center">
    <!-- intro -->
    <div class="vh-100 mt-8">
      <h1>SocialFeeds</h1>
      <h5>
        Get your favourite updates posted quickly from a range of supported sites.
        Scroll down for more info!<br><br>
        Currently in <span style="font-weight: 600;"><AnimatedNumber :number="guildCount" /></span> servers and sending <span style="font-weight: 600;"><AnimatedNumber :number="feedCount" /></span> feeds.
      </h5><br>

      <b-button class="cbtn cbtn-blurple large" :to="{ name: 'invite' }">
        <fa :icon="['fab', 'discord']" /> Add to Discord
      </b-button>
      <b-button class="cbtn cbtn-dark large" :to="{ name: 'dashboard' }">
        Dashboard
      </b-button>
    </div>

    <b-row cols="2" class="ml-2 mr-2 mb-4">
      <b-col lg="6">
        <b-img class="example-image" src="~assets/examples/discord-outage.png" w-100 fluid />
      </b-col>
      <b-col lg="4" class="align-middle">
        <h4>Monitor a range of sources.</h4>
        <p2>
          SocialFeeds offers a wide range of sources that you can keep track of. These consist of Reddit, RSS, Twitch,
          Twitter, Twitch, Reddit and even monitor Discord status updates in case of an outage.
        </p2>
      </b-col>
    </b-row><br>

    <b-row cols="2" class="ml-2 mr-2 mb-4 pb-5">
      <b-col lg="4" class="align-middle">
        <h4>New online dashboard</h4>
        <p2>
          We have completed our web dashboard and we are constantly updating to make sure it's easy to use and visually
          appealing. Here you can add new feeds to specific channels of your server or delete the ones you don't want to
          post anymore.
        </p2>
      </b-col>
      <b-col lg="6">
        <b-img class="example-image" src="~assets/examples/dashboard.png" w-100 fluid />
      </b-col>
    </b-row><br>

    <b-row cols="2" class="ml-2 mr-2 mb-4">
      <b-col lg="6">
        <b-img class="example-image" src="~assets/examples/rss.png" w-100 fluid />
      </b-col>
      <b-col lg="4" class="align-middle">
        <h4>Always online</h4>
        <p2>
          We try to keep SocialFeeds online as much as possible and we ensure you will never miss a feed. If the bot is
          ever down, it will automatically catch up wit all the feeds you missed instantly and you can use the dashboard.
          You can check out the status of the services <b-link href="/status">
            here.
          </b-link>
        </p2>
      </b-col>
    </b-row><br>
  </b-container>
</template>

<script>
import AnimatedNumber from '../components/AnimatedNumber'

export default {

  components: { AnimatedNumber },

  data: () => ({
    interval: false,
    guildCount: 0,
    feedCount: 0
  }),

  mounted () {
    this.update()
    this.interval = setInterval(() => this.update(), 60000)
  },

  beforeDestroy () {
    clearInterval(this.interval)
  },

  methods: {
    async update () {
      const { data: { clusters } } = await this.$axios.get('/status')
      const { data: { feedCount } } = await this.$axios.get('/feeds/counts/')

      this.guildCount = clusters.reduce((a, b) => a + b.guilds, 0)
      this.feedCount = feedCount
    }
  }

}
</script>
