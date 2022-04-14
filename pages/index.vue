<template>
  <div class="lander">
    <div class="content">
      <h1>Feeds directly to your server,<br /> without the hassle.</h1>
      <p>
        Updates from your favourite websites sent directly to your server.
        <br />
        <br />
        SocialFeeds removes the hassle of having to keep up to date across many social media platforms.
      </p>

      <div class="buttons">
        <Button>
          Add the bot
        </Button>
        <Button type="simple-light">
          Read more
        </Button>
      </div>
    </div>
    <img src="~assets/examples/example.png" />
  </div>
</template>

<script>
import Button from '@/components/Button.vue'

export default {
  components: { Button },

  data: () => ({
    interval: false
  }),

  computed: {
    feedCount () {
      return this.$store.getters['feeds/totalFeeds']
    },

    guildCount () {
      return this.$store.getters['stats/guildCount']
    },

    user () {
      return this.$store.getters['user/user']
    }
  },

  async mounted () {
    await this.update()
    this.interval = setInterval(() => this.update(), 60 * 1000)
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

<style lang="scss" scoped>
@import "@/assets/css/_variables.scss";

.lander {
  height: 80vh;
  display: flex;
  flex-direction: row;
  align-items: center;

  .content {
    padding: 10rem;

    h1 {
      font-family: $font-family-brand;
      font-weight: 600;
    }

    p {
      font-weight: 400;
    }
  }
}

img {
  width: 25rem;
  height: auto;
  border-radius: 0.5rem;
}
</style>
