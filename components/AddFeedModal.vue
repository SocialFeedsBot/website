<template>
  <div
    id="add-feed-modal"
    class="modal"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body">
          <!-- FEED TYPE SELECTION-->
          <p class="subheading">
            <strong>Type of feed</strong>
          </p>

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

          <!-- URL -->
          <p class="subheading">
            <strong>URL or account name</strong>
          </p>

          <div class="input-group mb-3 bg-dark text-light">
            <span v-if="addData.type == 'Twitter'" class="input-group-text bg-dark text-light">@</span>
            <input
              id="url"
              v-model="addData.url"
              type="text"
              class="form-control bg-dark text-light"
              placeholder="Username"
              aria-label="Username"
            >
          </div>

          <!-- Channel -->
          <p class="subheading">
            <strong>Channel to send the feed to</strong>
          </p>
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

          <!-- OPTIONS-->
          <p class="subheading">
            <strong>Feed options</strong>
          </p>
          <SwitchButton :is-enabled="addData.includeMessage" @toggle="toggleOption('message')">
            Include a custom message
          </SwitchButton>
          <SwitchButton v-if="addData.type === 'Twitter'" :is-enabled="addData.replies" @toggle="toggleOption('replies')">
            Include replies
          </SwitchButton>
          <SwitchButton v-if="addData.type === 'RSS'" :is-enabled="addData.excludeRSSDesc" @toggle="toggleOption('desc')">
            Exclude brief description (just send an embedded link)
          </SwitchButton>

          <div v-if="addData.includeMessage">
            <p class="subheading">
              Your custom message
            </p>
            <input
              id="custommsg"
              v-model="addData.message"
              class="form-control bg-dark text-light"
              type="text"
              autocomplete="off"
              placeholder="Custom message"
            >
          </div>
        </div>
        <div class="modal-footer">
          <a data-bs-dismiss="modal" aria-label="Close">
            <Button class="success" @click="tryCreate()">
              Add new Feed
            </Button>
          </a>
          <a data-bs-dismiss="modal" aria-label="Close">
            <Button class="light">
              Cancel
            </Button>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button.vue'
import SwitchButton from '@/components/SwitchButton.vue'

export default {
  components: { Button, SwitchButton },
  props: ['channels'],

  data () {
    return {
      addData: {
        replies: false,
        excludeRSSDesc: false,
        includeMessage: false,
        type: '',
        channel: '',
        url: '',
        message: ''
      },
      defaultAddData: { replies: false, excludeRSSDesc: false, includeMessage: false, type: '', channel: '', url: '', message: '' },
      channel: ''
    }
  },

  methods: {
    remove () {
      this.$emit('del')
    },

    toggleOption (opt) {
      if (opt === 'message') {
        this.addData.includeMessage = !this.addData.includeMessage
      } else if (opt === 'replies') {
        this.addData.replies = !this.addData.replies
      } else if (opt === 'desc') {
        this.addData.excludeRSSDesc = !this.addData.excludeRSSDesc
      }
    },

    async tryCreate () {
      if (this.addData.url === '' || this.addData.type === '' || this.addData.channel === '' || (this.addData.includeMessage && this.addData.message === '')) {
        this.$emit('error', 'You have not typed in all fields correctly.')
        return
      }

      const result = await this.create()
      if (typeof result === 'string') {
        this.$emit('error', result)
      }
    },

    async create () {
      try {
        await this.$axios.post(`/feeds/${this.$route.params.guild_id}`, {
          url: this.addData.url,
          type: this.addData.type.toLowerCase(),
          channelID: this.addData.channel,
          nsfw: this.channels.find(ch => ch.id === this.addData.channel).nsfw,
          options: { replies: this.addData.replies, excludeDesc: this.addData.excludeRSSDesc, message: this.addData.message || null }
        })
        this.$emit('update')
        this.addData = JSON.parse(JSON.stringify(this.defaultAddData))
        return 0
      } catch (e) {
        this.addData = JSON.parse(JSON.stringify(this.defaultAddData))
        return e.response ? e.response.data.error : e.message
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/_variables.scss";

  .subheading {
    text-transform: uppercase;
    font-size: 12px;
    font-weight: bolder;
    color: white;
    padding: .5rem;
    margin-bottom: 0;
    margin-top: 1rem;
  }

  .modal-content {
    background-color: $background-dark;
  }

  .modal-header, .modal-footer {
    border-bottom: 0;
    border-top: 0;
  }

  .modal {
    transform: scale(0.9);
    opacity: 0;
    -webkit-transition: all .15s ease-out;
    -o-transition: all .15s ease-out;
    transition: all .15s ease-out;
  }
  .modal.show {
    opacity: 1;
    transform: scale(1);
  }
</style>
