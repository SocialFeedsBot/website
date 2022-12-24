<template>
  <div class="home">
    <Header />

    <div class="services">
      <h1>
        Posts from the service to your server<span class="fullstop">.</span>
      </h1>
      <p>
        With many social-media platforms supported, you can quickly configure
        feeds to post from your favourite social media to your server
      </p>

      <div class="sources">
        <Source name="Twitter" />
        <Source name="RSS" />
        <Source name="YouTube" />
        <Source name="Twitch" />
        <Source name="Statuspage" />
        <Source name="Reddit" />
        <Source name="Roblox" is-new />
      </div>

      <div class="missed-one">
        <p>Think we've missed a service?</p>
        <router-link :to="{ path: '/support' }">
          Let us know
        </router-link>
      </div>
    </div>

    <div class="cta">
      <h1>
        Get feeds from your favourite social-medias to your servers<span class="fullstop">.</span>
      </h1>
      <p>
        Add SocialFeeds today and start receiving posts straight to your discord
        server.
      </p>

      <div class="buttons">
        <Button page="invite">
          Add the bot
        </Button>
        <Button page="dashboard" type="simple-light">
          Go to the dashboard
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button.vue'
import Header from '@/components/home/Header.vue'
import Source from '@/components/home/Source.vue'

export default {
  components: { Button, Source, Header },

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

.home {
  &>*:nth-child(2n) {
    background-color: $background-light;
  }
}

.services,
.cta {
  padding: 4rem;

  h1 {
    font-family: $font-family-brand;
    font-weight: 600;

    .fullstop {
      color: $blurple;
    }
  }
}

.services {
  .sources {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 1rem;
  }
}

.missed-one {
  margin-top: 2rem;
  text-align: center;
  color: $accent;

  p {
    margin: 0;
  }

  a {
    text-decoration: underline;
    color: $accent;

    &:hover {
      color: lighten($color: $accent, $amount: 5);
    }
  }
}

@media screen and (max-width: 1200px) {
  .lander {
    text-align: center;

    img {
      display: none;
    }

    .content {
      padding: 2rem;
      margin: 0 auto;
    }
  }

  .services .sources {
    grid-template-columns: auto;
  }
}
</style>
