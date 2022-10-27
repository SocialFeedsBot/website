<template>
  <div>
    <b-modal
      id="modify-feed-modal"
      centered
      title="Modify existing feed"
      header-class="modal-head"
      body-class="modal-cont"
      footer-class="modal-foot"
      modal-class="modal"
      hide-header-close
      style="display: none;"
    >
      <!-- BAILEY: its hidden bc i cant do this anymore im so sorry-->
      <p1 v-if="errorMessage !== ''" class="mb-4" style="color: #f54242">
        {{ errorMessage }}<br>
      </p1>
      <img :src="'/' + feed.type + '.png'" class="rounded-circle" height="25" width="25">
      <h3>{{ feed.display && feed.display.title ? feed.display.title : feed.url }}</h3><br>

      <br>
      <h3>Channel</h3>
      <b-dropdown v-model="editData.channel" :text="feed.channelID ? `#${channels.find(ch => ch.id === feed.channelID).name}` : 'Channel'" toggle-class="cbtn" class="full-length">
        <b-dropdown-item v-for="ch in channels.filter(c => c.type === 0)" :key="ch.id" @click="editData.channel = ch.id">
          #{{ ch.name }}
        </b-dropdown-item>
      </b-dropdown>

      <br><br>
      <h3>Feed options</h3>
      <SwitchButton :is-enabled="editData.includeMessage" @toggle="toggleMessage">
        Include a custom message
      </SwitchButton>
      <SwitchButton v-if="feed.type === 'twitter'" :is-enabled="editData.replies" @toggle="toggleReplies">
        Include replies
      </SwitchButton>
      <SwitchButton v-if="feed.type === 'rss'" :is-enabled="editData.excludeRSSDesc" @toggle="toggleRSSDesc">
        Exclude brief description (just send an embedded link)
      </SwitchButton>

      <div v-if="editData.includeMessage">
        <br>
        <h3>Custom message</h3>
        <b-form-input id="url" v-model="editData.message" autocomplete="off" placeholder="Custom message" />
      </div>

      <template #modal-footer>
        <b-button class="cbtn cbtn-green" @click="edit()">
          <span v-if="!loading">Edit feed</span>
          <img v-else src="@/assets/ellipsis.gif" width="20px" height="20px">
        </b-button>

        <b-button class="cbtn cbtn-dark" @click="close()">
          Cancel
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import SwitchButton from './SwitchButton'
export default {

  components: { SwitchButton },

  props: {
    channels: [],
    feed: { default: () => ({ webhook: { id: '', token: '' }, options: { replies: false, excludeDesc: false, message: '' }, type: '', channel: '', url: '', channelID: '' }) }
  },

  data: () => ({
    loading: false,
    errorMessage: '',
    editData: { replies: false, excludeRSSDesc: false, includeMessage: false, message: '', channel: '' },
    defaultEditData: { replies: false, excludeRSSDesc: false, includeMessage: false, message: '', channel: '' }
  }),

  mounted () {
    this.$root.$on('bv::modal::shown', (evt, id) => {
      if (id === 'modify-feed-modal') {
        console.log(this.feed)
        this.editData.replies = this.feed.options.replies
        this.editData.excludeRSSDesc = this.feed.options.excludeDesc
        this.editData.message = this.feed.options.message
        if (this.editData.message === undefined || this.editData.message === null || this.editData.message === '') {
          this.editData.includeMessage = false
        } else {
          this.editData.includeMessage = true
        }
      }
    })
  },

  methods: {
    // MODAL
    close () {
      this.$bvModal.hide('modify-feed-modal')
      this.editData = JSON.parse(JSON.stringify(this.defaultEditData))
      this.errorMessage = ''
    },
    async edit () {
      // VERIFY
      if (this.editData.channel === '') {
        this.editData.channel = this.feed.channelID
      }

      this.loading = true
      this.errorMessage = ''
      const result = await this.editFeed()
      this.loading = false
      if (typeof result === 'string') {
        this.errorMessage = `Error: ${result}`
      } else {
        this.close()
      }
    },

    toggleMessage (val) {
      this.editData.includeMessage = val
      this.editData.message = ''
    },

    toggleReplies (val) {
      this.editData.replies = val
    },

    toggleRSSDesc (val) {
      this.editData.excludeRSSDesc = val
    },

    async editFeed () {
      if (this.editData.includeMessage && this.editData.message === '') {
        return 'Include custom message is on but no message provided'
      }
      try {
        await this.$axios.patch('/feeds', {
          guildID: this.$route.params.guild_id,
          webhookID: this.feed.webhook.id,
          url: this.feed.url,
          type: this.feed.type.toLowerCase(),
          channelID: this.editData.channel,
          nsfw: this.channels.find(ch => ch.id === this.editData.channel).nsfw,
          options: { replies: this.editData.replies, excludeDesc: this.editData.excludeRSSDesc, message: this.editData.message || null }
        })
        this.$emit('update')
        return 0
      } catch (e) {
        return e.response ? e.response.data.error : e.message
      }
    }
  }

}
</script>
