<template>
  <b-container fluid class="mt-4">
    <!-- intro -->
    <div class="mt-8 ml-4 mr-4">
      <b-row cols="12">
        <b-col lg="7">
          <h1 class="pb-4">
            Get instant feeds to your server
          </h1>
          <h6 class="subheading pb-2">
            Get updates from your favourite websites sent directly to your Discord server.<br>
            Currently serving <span style="font-weight: 600;"><AnimatedNumber :number="guildCount" /></span> servers and posting <span style="font-weight: 600;"><AnimatedNumber :number="feedCount" /></span> feeds.
          </h6>

          <ul style="list-style-type:none;">
            <li class="subheading">
              <fa :icon="['fab', 'reddit']" /> Reddit
            </li>
            <li class="subheading">
              <fa icon="rss" /> RSS
            </li>
            <li class="subheading">
              <fa :icon="['fab', 'twitter']" /> Twitter
            </li>
            <li class="subheading">
              <fa :icon="['fab', 'twitch']" /> Twitch
            </li>
            <li class="subheading">
              <fa :icon="['fab', 'youtube']" /> YouTube
            </li>
            <li class="subheading">
              <fa :icon="['fas', 'exclamation-circle']" /> Status pages
            </li>
          </ul>

          <b-button class="cbtn cbtn-blurple large m-2" :to="{ name: 'invite' }">
            <fa :icon="['fab', 'discord']" /> Add to Discord
          </b-button>
          <b-button class="cbtn cbtn-dark large m-2" :to="{ name: 'dashboard' }">
            Dashboard
          </b-button>
        </b-col>

        <b-col lg="5">
          <b-img alt="rss feed example" class="example-image" src="~assets/examples/rss.png" w-100 fluid />
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script>
import AnimatedNumber from '../components/AnimatedNumber'

export default {

  components: { AnimatedNumber },

  data: () => ({
    interval: false
  }),

  computed: {
    feedCount () {
      return this.$store.getters['feeds/totalFeeds']
    },

    guildCount () {
      return this.$store.getters['stats/guildCount']
    }
  },

  mounted () {
    this.update()
    this.interval = setInterval(() => this.update(), 60000)
  },

  beforeDestroy () {
    clearInterval(this.interval)
  },

  methods: {
    async update () {
      await this.$store.dispatch('feeds/GET_TOTAL_FEEDS')
      await this.$store.dispatch('stats/GET_GUILD_COUNT')
    }
  }

}
</script>
