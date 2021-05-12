<template>
  <div>
    <div v-if="!guild.id && !channels">
      <div style="text-align: center;">
        <img src="@/assets/loading.gif" width="100px" height="100px" alt="loading">
      </div>
    </div>

    <div v-else>
      <AddFeedModal :channels="channels" @update="update()" />
      <ModifyFeedModal :channels="channels" :feed="toModify" @update="update()" />

      <b-container class="mt-4 mb-3 pb-3 pt-2 guild-info">
        <div class="row p-2">
          <div class="col-3 col-lg-2 col-md-2 col-sm-3">
            <div class="d-inline-block">
              <img :src="'https://cdn.discordapp.com/icons/' + guild.id + '/' + guild.icon + '.png'" class="rounded-circle" height="100%" width="100%" alt="guild icon">
            </div>
          </div>

          <div class="col-9 col-lg-10 col-md-7">
            <div class="h4 d-inline-block" style="font-weight: 700;">
              {{ guild.name }}
            </div>
            <p style="font-weight: 100;">
              Total feeds: {{ feedCount }}
            </p>

            <b-button class="cbtn cbtn-dark my-2 w-90" :to="{ name: 'dashboard' }">
              Switch Server
            </b-button>
            <b-button class="cbtn cbtn-dark my-2 w-90" @click="update()">
              Refresh feeds
            </b-button>
            <b-button v-b-modal.add-feed-modal class="cbtn cbtn-green w-90">
              Add new feed
            </b-button>
          </div>
        </div>
      </b-container>

      <!-- feeds -->
      <br>
      <b-container v-if="feedCount > 0" class="mb-3">
        <div v-for="(fs, channelID) in feeds" :key="channelID">
          <br><h4 class="channel-header">
            #{{ channels.find(ch => ch.id === channelID).name.toUpperCase() }} ({{ fs.length }})
          </h4><br>
          <b-row>
            <FeedBlock v-for="(feed, i) in fs" :key="channelID + '-' + i" :data="feed" @setPrompt="toggleData('prompt', feed)" @setModify="toggleData('modify', feed)" />
          </b-row>
        </div>
      </b-container>

      <div v-else class="center">
        <h1>No feeds added yet.</h1>
        <p>Press the <code>Add new feed</code> button at the top of the page to start.</p>
      </div>

      <DeleteFeedModal @removeFeed="remove(deletePrompt)" />
    </div>
  </div>
</template>

<script>
import FeedBlock from '@/components/FeedBlock.vue'
import AddFeedModal from '../../../components/AddFeedModal'
import ModifyFeedModal from '../../../components/ModifyFeedModal'
import DeleteFeedModal from '../../../components/DeleteFeedModal'

export default {

  components: { FeedBlock, AddFeedModal, ModifyFeedModal, DeleteFeedModal },

  data () {
    return {
      guild: {},
      toModify: {},
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

      this.channels = Object.values(channels).sort((a, b) => a.position - b.position)
      this.guild = guild

      const orderedFeeds = {}
      this.channels.forEach((channel) => {
        const channelFeeds = feeds.filter(doc => doc.channelID === channel.id)
        if (channelFeeds.length > 0) {
          orderedFeeds[channel.id] = channelFeeds
        }
      })

      this.feeds = orderedFeeds
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

    toggleData (type, feed) {
      if (type === 'prompt') {
        this.deletePrompt = feed
        this.$bvModal.show('remove-feed-modal')
      } else if (type === 'modify') {
        this.toModify = feed
        this.$bvModal.show('modify-feed-modal')
      }
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
