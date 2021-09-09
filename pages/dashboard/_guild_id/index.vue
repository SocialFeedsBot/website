<template>
  <div>
    <div v-if="ready == true">
      <AddFeedModal :channels="channels" @update="update()" />
      <ModifyFeedModal :channels="channels" :feed="toModify" @update="update()" />
    </div>

    <b-container class="mt-4 mb-3 pb-3 pt-2 guild-info">
      <div class="row p-2">
        <div class="col-3 col-lg-2 col-md-2 col-sm-3">
          <div class="d-inline-block">
            <img :src="getGuildIcon(guild)" class="rounded-circle skeleton" style="height: 100px; width:100px;" alt="guild icon">
          </div>
        </div>

        <div class="col-9 col-lg-10 col-md-7">
          <div class="h4 d-inline-block" style="font-weight: 700;" :class="{ 'skeleton': ready == false, 'skeleton-text': ready == false }">
            {{ guild.name }}
          </div>

          <p style="font-weight: 100;">
            Total feeds: {{ feedCount }}
          </p>

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
    <b-container v-if="ready == true && feedCount > 0" class="mb-3">
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
      <h1>You haven't added any feeds yet...</h1>
      <p>To add a new feed, press the <code>Add Feed</code> button at the top of the page!</p>
    </div>

    <DeleteFeedModal @removeFeed="remove(deletePrompt)" />
  </div>
</template>

<script>
import AddFeedModal from '../../../components/AddFeedModal'
import ModifyFeedModal from '../../../components/ModifyFeedModal'
import DeleteFeedModal from '../../../components/DeleteFeedModal'
import FeedBlock from '@/components/FeedBlock.vue'

export default {

  components: { FeedBlock, AddFeedModal, ModifyFeedModal, DeleteFeedModal },

  data () {
    return {
      ready: false,
      toModify: {},
      deletePrompt: {}
    }
  },

  computed: {
    feeds () {
      return this.$store.getters['feeds/feeds']
    },

    feedCount () {
      return this.$store.getters['feeds/count']
    },

    guild () {
      return this.$store.getters['guild/guild']
    },

    channels () {
      return this.$store.getters['guild/channels']
    }
  },

  async mounted () {
    await this.update()
  },

  methods: {
    async update () {
      this.ready = false
      await this.$store.dispatch('guild/GET_GUILD', this.$route.params.guild_id)
      await this.$store.dispatch('feeds/GET_FEEDS', this.$route.params.guild_id)
      this.ready = true
    },

    getGuildIcon (guild) {
      if (guild && guild.icon) {
        return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
      } else {
        return '/static/blank-server.png'
      }
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
  background: rgb(39, 44, 53);
  border-radius: 10px;
  border-width: 5px;
  box-shadow: rgb(20, 22, 27) 2px 2px 2px;
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
