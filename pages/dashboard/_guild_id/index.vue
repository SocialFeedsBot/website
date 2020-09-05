<template>
  <div>
    <div v-if="!guild.id && !channels">
      <div style="text-align: center;">
        <img src="@/assets/loading.svg" width="100px" height="100px" alt="loading">
      </div>
    </div>

    <div v-else>
      <b-container class="mt-4 mb-5 pb-3 pt-3 guild-info">
        <div class="row">
          <div class="col-2 pr-1 text-right">
            <div class="d-inline-block">
              <img :src="'https://cdn.discordapp.com/icons/' + guild.id + '/' + guild.icon + '.png'" class="rounded-circle" height="150" width="150" alt="guild icon">
            </div>
          </div>

          <div class="col-8 mt-4 text-left">
            <div class="h3 d-inline-block">
              {{ guild.name }}
            </div>
            <div class="p">
              Total feeds: {{ feeds.flat().map(f => f.feeds).flat().length }}
            </div>
          </div>

          <div class="col-2 mt-4 mb-3">
            <b-button class="discord-button-blue">Add Feed</b-button>
            <b-button class="button-transparent" :to="{ name: 'dashboard' }">Switch Server</b-button>
          </div>
        </div>
      </b-container>

      <!-- feeds -->
      <b-container class="mb-3">
        <div v-if="feeds.length === 0" style="text-align: center;">
          <h2>No feeds setup in this server</h2>
          <p>Add one using the df!add command or press 'Add' in the top corner.</p>
        </div>
        <div v-for="channelFeeds in feeds" v-else :key="channelFeeds[0].channelID">
          <h4 class="channel-header">
            #{{ channels[channelFeeds[0].channelID].name.toUpperCase() }} ({{ channelFeeds.length }})
          </h4><br>
          <b-row>
            <FeedBlock v-for="(feed, i) in channelFeeds" :key="feed.channelID + '-' + i" :data="feed" @remove="remove(feed)" />
          </b-row>
        </div>
      </b-container>
    </div>
  </div>
</template>

<script>
import FeedBlock from '@/components/FeedBlock.vue'

export default {

  components: { FeedBlock },

  data () {
    return {
      guild: {},
      feeds: [],
      channels: null
    }
  },

  async mounted () {
    await this.update()
  },

  methods: {
    async update () {
      let guild
      try {
        guild = (await this.$axios.get(`/guilds/${this.$route.params.guild_id}`)).data
      } catch (e) {
        window.location = '/dashboard'
      }

      const channels = (await this.$axios.get(`/guilds/${this.$route.params.guild_id}/channels`)).data
      const feeds = (await this.$axios.get(`/feeds/${this.$route.params.guild_id}`)).data

      this.channels = channels
      this.guild = guild

      const webhooks = [...new Set(feeds.map(feed => feed.token))]
      this.feeds = await Promise.all(webhooks.map((webhookToken) => {
        const feed = feeds.find(f => f.token === webhookToken)
        return feeds.filter(f => f._id === feed._id)
      }))
    },

    async remove (data) {
      try {
        await this.$axios.delete(`/feeds/delete`, {
          data: {
            guildID: this.$route.params.guild_id,
            feed: { url: data.url, type: data.type },
            webhook: { id: data.webhook.id, token: data.webhook.token }
          }
        })
        this.$bvToast.toast(`Feed removed successfully!`, {
          title: 'Success',
          autoHideDelay: 6000,
          appendToast: false,
          variant: 'success'
        })
        await this.update()
      } catch (e) {
        this.$bvToast.toast('Try again later.', {
          title: 'Error removing feed',
          autoHideDelay: 6000,
          appendToast: false,
          variant: 'danger'
        })
      }
    }
  }

}
</script>

<style>
.channel-header {
  font-size: 16px;
  color: white;
  font-weight: 600;
  flex: 1;
  margin: 0;
  padding: 0;
  border: 0;
  vertical-align: baseline;
}

.guild-info {
  background: rgba(32,34,37,0.5);
  border-radius: 10px;
  border-width: 5px;
}

.discord-button-blue {
  background: #7289DA;
  color: #fff;
  border-radius: 3px;
  border: none;
  padding: 2px 16px;
  box-sizing: border-box;
}
.discord-button-blue:hover {
  background: #5c73bd;
  color: #fff;
  box-sizing: border-box;
}

.button-transparent {
  border: transparent;
  color: #fff;
  border-radius: 3px;
  border: none;
  padding: 2px 16px;
  box-sizing: border-box;
}
.button-transparent:hover {
  border: transparent;
  color: #d1d1d1;
}
.button-transparent, .button-transparent:hover {
  background: transparent
}
</style>
