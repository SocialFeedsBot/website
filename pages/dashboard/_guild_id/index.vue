<template>
  <div v-if="ready">
    <div class="guild-header grid">
      <div class="col-sm-3 col-md-2 col-lg-1">
        <img v-if="guild.icon" class="rounded-circle" :src="getGuildIcon()" height="75" width="75">
        <div v-else class="guild-icon blankGuild lg">
          <div class="blankGuildName lg">
            {{ acronym(guild?.name) }}
          </div>
        </div>
      </div>
      <div class="col-sm-7 col-md-8 col-lg-9">
        <h2>{{ guild.name }}</h2>
        <p :style="{ color: feedCount >= guild.premium.maxFeeds ? 'red' : '' }">
          {{ feedCount }}/{{ guild.premium.maxFeeds }} total feeds used.
          {{ feedCount >= guild.premium.maxFeeds ? 'You cannot add any feeds until you upgrade.' : '' }}
        </p>
      </div>
      <div class="col-sm-2 col-md-2 col-lg-2">
        <Button v-if="feedCount < guild.premium.maxFeeds" type="success" data-bs-toggle="modal" data-bs-target="#add-feed-modal">
          Add new feed
        </Button>
        <a v-else href="/premium">
          <Button type="warn">
            Upgrade now!
          </Button>
        </a>
      </div>
    </div>

    <div v-if="errMessage" class="error-box">
      <h3>Something went wrong adding this feed.</h3>
      <p>{{ errMessage }}</p>
    </div>

    <!-- WIP: Feed list-->
    <div v-if="ready == true && feedCount > 0" class="container mb-4">
      <div v-for="(fs, channelID) in feeds" :key="channelID">
        <br>
        <p class="channel-header">
          #{{ channels.find(ch => ch.id === channelID).name.toLowerCase() }}
        </p>

        <div class="row">
          <FeedBlock
            v-for="(feed, i) in fs"
            :key="channelID + '-' + i"
            :feed="feed"
            @del="setDeletingFeed(feed)"
            @modify="setModifyingFeed(feed)"
            @update="updateFeeds()"
          />
        </div>
      </div>
    </div>

    <DeleteModal @del="deleteFeed()" />
    <AddModal :channels="channels" @error="handleError" @update="updateFeeds" />
    <ModifyModal :channels="channels" :feed="toModify" @update="updateFeeds" @edit="editFeed" />
  </div>
  <div v-else class="container mb-5 pb-3 w-75">
    <div style="text-align: center;" class="mt-4">
      <img src="@/assets/loading.gif" height="100" width="100">
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button.vue'
import FeedBlock from '@/components/FeedBlock.vue'
import DeleteModal from '@/components/DeleteFeedModal.vue'
import AddModal from '@/components/AddFeedModal.vue'
import ModifyModal from '@/components/ModifyFeedModal.vue'

export default {

  components: { Button, FeedBlock, DeleteModal, AddModal, ModifyModal },

  layout: 'dashboard',

  data () {
    return { ready: false, deletingFeed: null, errMessage: null, toModify: null }
  },

  computed: {

    guild () {
      return this.$store.getters['guild/guild']
    },

    user () {
      return this.$store.getters['user/user']
    },

    channels () {
      return this.$store.getters['guild/channels']
    },

    feeds () {
      return this.$store.getters['feeds/feeds']
    },

    feedCount () {
      return this.$store.getters['feeds/count']
    }

  },

  async mounted () {
    await this.$store.dispatch('guild/GET_GUILD', this.$route.params.guild_id)
    await this.$store.dispatch('feeds/GET_FEEDS', this.$route.params.guild_id)

    // const res = await this.$axios.post('/premium/checkout', { tier: 1, userID: this.user.id, guildID: this.$route.params.guild_id })
    // window.location = res.data.url
    this.ready = true
  },

  methods: {
    getGuildIcon () {
      return `https://cdn.discordapp.com/icons/${this.guild.id}/${this.guild.icon}.png?size=256`
    },

    acronym (name) {
      return name.split(/\s/).reduce((accumulator, word) => {
        return accumulator + word.charAt(0)
      }, '')
    },

    // feed functions

    async updateFeeds () {
      await this.$store.dispatch('feeds/GET_FEEDS', this.$route.params.guild_id)
    },

    setDeletingFeed (feed) {
      this.deletingFeed = feed
    },

    setModifyingFeed (feed) {
      this.toModify = feed
    },

    async deleteFeed () {
      try {
        await this.$axios.delete(`/feeds/${this.$route.params.guild_id}`, {
          data: {
            url: this.deletingFeed.url,
            type: this.deletingFeed.type,
            webhookID: this.deletingFeed.webhookID
          }
        })

        await this.updateFeeds()
      } catch (e) {
      }

      this.deletingFeed = null
    },

    async editFeed (data) {
      try {
        await this.$axios.patch(`/feeds/${this.$route.params.guild_id}`, {
          webhookID: this.toModify.webhookID,
          url: this.toModify.url,
          newURL: data.newURL || this.toModify.url,
          type: this.toModify.type.toLowerCase(),
          channelID: data.channel || this.toModify.channelID,
          nsfw: this.channels.find(ch => ch.id === (data.channel || this.toModify.channelID)).nsfw,
          options: { replies: data.replies || this.toModify.options.replies, excludeRSSDesc: data.excludeDesc || this.toModify.options.excludeRSSDesc, message: data.message || this.toModify.options.message || null }
        })
        this.updateFeeds()
      } catch (e) {
        this.handleError(e.response ? e.response.data.error : e.message)
      }
    },

    handleError (e) {
      this.errMessage = e
      setTimeout(() => {
        this.errMessage = null
      }, 5000)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/_variables.scss";

.guild-header {
  background: $background-light;
  width: 100%;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  padding-bottom: 1px;
}

.blankGuild {
  background-color: #2e3338;
  width: 35px;
  height: 35px;
  border-radius: 50% !important;
}
.blankGuild.lg {
  width: 75px;
  height: 75px;
}
.blankGuildName {
  font-size: 20px;
  text-align: center;
  color: #707070
}
.blankGuildName.lg {
  font-size: 45px;
}

.channel-header {
  font-size: 16px;
  color: #9c9b9b;
  vertical-align: baseline;
}

.error-box {
  margin: 20px 0;
  padding: 10px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 300;
  line-height: 22px;
  border: 2px solid rgb(233, 104, 104); background-color: rgb(233, 104, 104, 0.1)
}

</style>
