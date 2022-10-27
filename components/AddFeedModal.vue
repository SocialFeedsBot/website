<template>
  <div id="add-feed-modal" class="modal fade" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content bg-dark p-2">
        <p1 v-if="errorMessage !== ''" class="mb-4 alert alert-danger">
          {{ errorMessage }}<br>
        </p1>

        <h3 class="mt-2 mb-2">
          Select the type of feed to add:
        </h3>
        <div class="dropdown">
          <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
            {{ addData.type ? addData.type : 'Feed type' }}
          </button>
          <ul class="dropdown-menu dropdown-menu-dark">
            <li class="dropdown-item" @click="addData.type = 'Reddit'">
              <fa :icon="['fab', 'reddit']" /> Reddit
            </li>
            <li class="dropdown-item" @click="addData.type = 'RSS'">
              <fa icon="rss" /> RSS
            </li>
            <li class="dropdown-item" @click="addData.type = 'Twitter'">
              <fa :icon="['fab', 'twitter']" /> Twitter
            </li>
            <li class="dropdown-item" @click="addData.type = 'Twitch'">
              <fa :icon="['fab', 'twitch']" /> Twitch
            </li>
            <li class="dropdown-item" @click="addData.type = 'YouTube'">
              <fa :icon="['fab', 'youtube']" /> YouTube
            </li>
            <li class="dropdown-item" @click="addData.type = 'StatusPage'">
              <fa :icon="['fas', 'exclamation-circle']" /> Status Page
            </li>
          </ul>
        </div>

        <h3 class="mt-2">
          URL
        </h3>

        <div class="input-group mb-3 bg-dark text-light">
          <!-- If twitter show @ symbol etc. -->
          <span class="input-group-text bg-dark text-light">@</span>
          <input
            id="url"
            v-model="addData.url"
            type="text"
            class="form-control bg-dark text-light"
            placeholder="Username"
            aria-label="Username"
          >
        </div>
        <h3 class="mt-2">
          Channel
        </h3>
        <div class="dropdown">
          <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
            {{ addData.channel ? `#${channels.find(ch => ch.id === addData.channel).name}` : 'Channel' }}
          </button>
          <ul class="dropdown-menu dropdown-menu-dark">
            <li
              v-for="ch in channels.filter(c => c.type === 0)"
              :key="ch.id"
              class="dropdown-item"
              @click="addData.channel = ch.id"
            >
              #{{ ch.name }}
            </li>
          </ul>
        </div>

        <br><br>
        <h3>Feed options</h3>
        <SwitchButton :is-enabled="addData.includeMessage" @toggle="toggleMessage">
          Include a custom message
        </SwitchButton>
        <SwitchButton v-if="addData.type === 'Twitter'" :is-enabled="addData.replies" @toggle="toggleReplies">
          Include replies
        </SwitchButton>
        <SwitchButton v-if="addData.type === 'RSS'" :is-enabled="addData.excludeRSSDesc" @toggle="toggleRSSDesc">
          Exclude brief description (just send an embedded link)
        </SwitchButton>

        <div v-if="addData.includeMessage">
          <br>
          <h3>Custom message</h3>
          <b-form-input id="url" v-model="addData.message" autocomplete="off" placeholder="Custom message" />
        </div>

        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
          <button class="btn btn-dark me-md-2" @click="close()">
            Cancel
          </button>
          <button class="btn btn-success" @click="add()">
            <span v-if="!loading">Add feed</span>
            <img v-else src="@/assets/ellipsis.gif" width="20px" height="20px">
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SwitchButton from './SwitchButton'
export default {

  components: { SwitchButton },

  props: {
    // eslint-disable-next-line vue/require-prop-types
    channels: { default: () => { } }
  },

  data: () => ({
    loading: false,
    errorMessage: '',
    channel: '',
    addData: { replies: false, excludeRSSDesc: false, includeMessage: false, type: '', channel: '', url: '', message: '' },
    defaultAddData: { replies: false, excludeRSSDesc: false, includeMessage: false, type: '', channel: '', url: '', message: '' }
  }),

  methods: {
    // MODAL
    close () {
      this.$bvModal.hide('add-feed-modal')
      this.addData = JSON.parse(JSON.stringify(this.defaultAddData))
      this.errorMessage = ''
    },
    async add () {
      this.loading = true
      this.errorMessage = ''
      const result = await this.addFeed()
      this.loading = false
      if (typeof result === 'string') {
        this.errorMessage = `Error: ${result}`
      } else {
        this.close()
      }
    },

    toggleMessage (val) {
      this.addData.includeMessage = val
      this.addData.message = ''
    },

    toggleReplies (val) {
      this.addData.replies = val
    },

    toggleRSSDesc (val) {
      this.addData.excludeRSSDesc = val
    },

    async addFeed () {
      if (this.addData.url === '' || this.addData.type === '' || this.addData.channel === '' || (this.addData.includeMessage && this.addData.message === '')) {
        return 'Please ensure you fill in all fields.'
      }
      try {
        await this.$axios.post('/feeds', {
          guildID: this.$route.params.guild_id,
          url: this.addData.url,
          type: this.addData.type.toLowerCase(),
          channelID: this.addData.channel,
          nsfw: this.channels.find(ch => ch.id === this.addData.channel).nsfw,
          options: { replies: this.addData.replies, excludeDesc: this.addData.excludeRSSDesc, message: this.addData.message || null }
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
