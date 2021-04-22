<template>
  <div>
    <div v-if="!guild.id && !channels">
      <div style="text-align: center;">
        <img src="@/assets/loading.gif" width="100px" height="100px" alt="loading">
      </div>
    </div>

    <div v-else>
      <b-container class="mt-4 mb-3 pb-3 pt-2 guild-info">
        <div class="row">
          <div class="col-1 mr-5 text-right">
            <div class="d-inline-block">
              <img :src="'https://cdn.discordapp.com/icons/' + guild.id + '/' + guild.icon + '.png'" class="rounded-circle" height="100" width="100" alt="guild icon">
            </div>
          </div>

          <div class="col-6 ml-5 mt-3 text-left">
            <div class="h3 d-inline-block" style="font-weight: 700;">
              {{ guild.name }}
            </div>
            <div class="p" style="font-weight: 100;">
              Total feeds: {{ feedCount }}
            </div>
          </div>

          <div class="col-2 ml-5 mt-3">
            <AddFeedModal :channels="channels" @addFeed="addFeed" />
          </div>
        </div>
      </b-container>

      <!-- feeds -->
      <br>
      <b-container class="mb-3">
        <div v-for="(fs, channelID) in feeds" :key="channelID">
          <br><h4 class="channel-header">
            #{{ channels[channelID].name.toUpperCase() }} ({{ fs.length }})
          </h4><br>
          <b-row>
            <FeedBlock v-for="(feed, i) in fs" :key="channelID + '-' + i" :data="feed" @remove="remove(feed)" />
          </b-row>
        </div>
      </b-container>
    </div>
  </div>
</template>

<script>
import FeedBlock from '@/components/FeedBlock.vue'
import AddFeedModal from '../../../components/AddFeedModal'

export default {

  components: { FeedBlock, AddFeedModal },

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
      const feedInfo = (await this.$axios.get(`/feeds/${this.$route.params.guild_id}`)).data
      const feeds = []

      feeds.push(...feedInfo.feeds)
      for (let i = 1; i < feedInfo.pages; i++) {
        const data = (await this.$axios.get(`/feeds/${this.$route.params.guild_id}?page=${i + 1}`)).data
        feeds.push(...data.feeds)
      }

      this.channels = channels
      this.guild = guild

      const groups = {}
      feeds.forEach((doc) => {
        if (channels[doc.channelID]) {
          if (!groups[doc.channelID]) { groups[doc.channelID] = [] }
          groups[doc.channelID].push({ ...doc, channelName: channels[doc.channelID].name })
        }
      })
      this.feeds = groups
      this.feedCount = feeds.length
    },

    toggleMessage (val) {
      this.addData.includeMessage = val
    },

    toggleReplies (val) {
      this.addData.replies = val
    },

    toggleRSSDesc (val) {
      this.addData.excludeRSSDesc = val
    },

    async remove (data) {
      try {
        await this.$axios.delete('/feeds', {
          data: {
            url: data.url,
            type: data.type,
            webhookID: data.webhook.id,
            guildID: this.$route.params.guild_id
          }
        })
        this.$bvToast.toast('Feed removed successfully!', {
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
    },

    async addFeed (data) {
      if (data.url === '' || data.type === '' || data.channel === '' || (data.includeMessage && data.message === '')) {
        this.$bvToast.toast('Please ensure you fill in the feed type, url and the channel.', {
          title: 'Error',
          autoHideDelay: 6000,
          appendToast: false,
          variant: 'warning'
        })
        return
      }
      try {
        await this.$axios.post('/feeds', {
          guildID: this.$route.params.guild_id,
          url: data.url,
          type: data.type.toLowerCase(),
          channelID: data.channel,
          nsfw: this.channels[data.channel].nsfw,
          options: { replies: data.replies, excludeDesc: data.excludeRSSDesc, message: data.message || null }
        })
        this.$bvToast.toast('Created new feed!', {
          title: 'Success',
          autoHideDelay: 6000,
          appendToast: false,
          variant: 'success'
        })
        await this.update()
      } catch (e) {
        this.$bvToast.toast(`Try again later, error message: ${e.response.data.error}`, {
          title: 'Unable to add feed at this time.',
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
  color: darkgrey;
  font-weight: 600;
  flex: 1;
  margin: 0;
  padding: 0;
  border: 0;
  vertical-align: baseline;
}

.guild-info {
  background: rgb(23, 24, 27);
  border-radius: 10px;
  border-width: 5px;
  box-shadow: 0 0 5px 2px #23272A;
}

#url {
  background-color: #23272A;
  border-color: #1b1b1b;
  border-radius: 1px;
  color: #ffffff
}

.check-box {
  background: #23272A
}
</style>
