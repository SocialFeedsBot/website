<template>
  <div>
    <!-- <div v-if="ready == true"> -->
    <AddFeedModal :channels="channels" @update="update()" />
    <ModifyFeedModal :channels="channels" :feed="toModify" @update="update()" />
    <!-- </div> -->

    <div class="mb-3 p-1 guild-info">
      <div class="row p-1">
        <div class="col-lg-1 col-md-1 col-sm-1">
          <div class="p-1">
            <img
              :src="getGuildIcon(guild)"
              class="rounded-circle"
              style="height: 50px; width:50px;"
              alt="guild icon"
            >
          </div>
        </div>

        <div class="col-lg-6 md-6 sm-4 p-2" style="">
          <h4>
            {{ guild.name }}
          </h4>
        </div>

        <div class="col-lg-5 col-md-5 col-sm-5">
          <b-button v-b-modal.add-feed-modal>
            <Button>Add feed</Button> <!-- TODO: open add feed modal-->
          </b-button>
          <Button>Upgrade to premium!</Button> <!--  TODO: to only be shown when the server isn't premium -->
        </div>
      </div>
    </div>

    <!-- Button trigger modal -->
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-feed-modal">
      Launch demo modal
    </button>

    <!-- Modal -->
    <div id="exampleModal" class="modal fade" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 id="exampleModalLabel" class="modal-title fs-5">
              Modal title
            </h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>
          <div class="modal-body">
            ...
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
            <button type="button" class="btn btn-primary">
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- feeds -->
    <br>
    <div v-if="ready == true && feedCount > 0" class="container mb-4">
      <div v-for="(fs, channelID) in feeds" :key="channelID">
        <br>
        <h4 class="channel-header">
          #{{ channels.find(ch => ch.id === channelID).name.toUpperCase() }} ({{ fs.length }})
        </h4><br>
        <div class="row">
          <FeedBlock
            v-for="(feed, i) in fs"
            :key="channelID + '-' + i"
            :data="feed"
            @setPrompt="toggleData('prompt', feed)"
            @setModify="toggleData('modify', feed)"
          />
        </div>
      </div>
    </div>

    <div v-else class="center">
      <h1>You haven't added any feeds yet...</h1>
      <p>To add a new feed, press the <code>Add Feed</code> button at the top of the page!</p>
    </div>

    <DeleteFeedModal @removeFeed="remove(deletePrompt)" />
  </div>
</template>

<script>
import AddFeedModal from '@/components/AddFeedModal'
import ModifyFeedModal from '@/components/ModifyFeedModal'
import DeleteFeedModal from '@/components/DeleteFeedModal'
import FeedBlock from '@/components/FeedBlock.vue'
import Button from '@/components/Button'

export default {

  components: { FeedBlock, AddFeedModal, ModifyFeedModal, DeleteFeedModal, Button },

  layout: 'dashboard',

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
      if (!this.guild || !this.guild.name) {
        await this.$store.dispatch('guild/GET_GUILD', this.$route.params.guild_id)
      }
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
  background: rgba(39, 44, 53, 0.601);
  border-radius: 10px;
  border-width: 5px;
  box-shadow: rgba(20, 22, 27, 0.532) 1px 1px 1px;
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
