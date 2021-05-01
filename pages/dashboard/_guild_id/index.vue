<template>
  <div>
    <div v-if="!guild.id && !channels">
      <div style="text-align: center;">
        <img src="@/assets/loading.gif" width="100px" height="100px" alt="loading">
      </div>
    </div>

    <div v-else>
      <AddFeedModal :channels="channels" @addFeed="addFeed" @update="update()" />

      <b-container class="mt-4 mb-3 pb-3 pt-2 guild-info">
        <div class="row p-2">
          <div class="col-3 col-md-1">
            <div class="d-inline-block">
              <img :src="'https://cdn.discordapp.com/icons/' + guild.id + '/' + guild.icon + '.png'" class="rounded-circle" height="100%" width="100%" alt="guild icon">
            </div>
          </div>

          <div class="col-9 col-md-7">
            <div class="h4 d-inline-block" style="font-weight: 700;">
              {{ guild.name }}
            </div>
            <p style="font-weight: 100;">
              Total feeds: {{ feedCount }}
            </p>
          </div>

          <div class="col-12 col-md-4 d-inline-block">
            <b-button class="cbtn cbtn-dark my-2 w-90" :to="{ name: 'dashboard' }">
              Switch Server
            </b-button>
            <b-button v-b-modal.add-feed-modal class="cbtn cbtn-green w-90">
              Add new feed
            </b-button>
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
            <FeedBlock v-for="(feed, i) in fs" :key="channelID + '-' + i" :data="feed" @setPrompt="setPrompt(feed)" />
          </b-row>
        </div>
      </b-container>

      <DeleteFeedModal @removeFeed="remove(deletePrompt)" />
    </div>
  </div>
</template>

<script>
import FeedBlock from '@/components/FeedBlock.vue'
import AddFeedModal from '../../../components/AddFeedModal'
import DeleteFeedModal from '../../../components/DeleteFeedModal'

export default {

  components: { FeedBlock, AddFeedModal, DeleteFeedModal },

  data () {
    return {
      guild: {},
      feeds: [],
      deletePrompt: {},
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

    setPrompt (feed) {
      this.deletePrompt = feed
      this.$bvModal.show('remove-feed-modal')
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

        this.update()
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
