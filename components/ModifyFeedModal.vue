<template>
  <div
    id="modify-feed-modal"
    class="modal"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body">
          <h6>
            <strong>Modify feed options, leave blank to keep the same</strong>
          </h6>
          <!-- URL -->
          <p class="subheading">
            <strong>New URL or new account name</strong>
          </p>

          <div class="input-group mb-3 bg-dark text-light">
            <span v-if="editData.type == 'Twitter'" class="input-group-text bg-dark text-light">@</span>
            <input
              id="url"
              v-model="editData.newURL"
              type="text"
              class="form-control bg-dark text-light"
              placeholder="Username"
              aria-label="Username"
            >
          </div>

          <!-- OPTIONS-->
          <p class="subheading">
            <strong>Update feed options</strong>
          </p>
          <SwitchButton :is-enabled="editData.includeMessage" @toggle="toggleOption('message')">
            Include a custom message
          </SwitchButton>
          <SwitchButton v-if="editData.type === 'Twitter'" :is-enabled="editData.replies" @toggle="toggleOption('replies')">
            Include replies
          </SwitchButton>
          <SwitchButton v-if="editData.type === 'RSS'" :is-enabled="editData.excludeDesc" @toggle="toggleOption('desc')">
            Exclude brief description (just send an embedded link)
          </SwitchButton>

          <div v-if="editData.includeMessage">
            <p class="subheading">
              Your custom message
            </p>
            <input
              id="custommsg"
              v-model="editData.message"
              class="form-control bg-dark text-light"
              type="text"
              autocomplete="off"
              placeholder="Custom message"
            >
          </div>
        </div>
        <div class="modal-footer">
          <a data-bs-dismiss="modal" aria-label="Close">
            <Button class="success" @click="edit()">
              Modify Feed
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
  props: {
    channels: [],
    feed: { default: () => ({ webhook: { id: '', token: '' }, options: { replies: false, excludeDesc: false, message: '' }, type: '', channel: '', url: '', channelID: '' }) }
  },

  data () {
    return {
      editData: { replies: false, excludeDesc: false, includeMessage: false, message: '', channel: '', newURL: '' },
      defaultEditData: { replies: false, excludeDesc: false, includeMessage: false, message: '', channel: '', newURL: '' }
    }
  },

  methods: {
    edit () {
      // VERIFY
      if (this.editData === this.defaultEditData) {
        this.$emit('update')
        return
      }

      const d = {}
      Object.keys(this.defaultEditData).forEach((k) => {
        console.log(k, this.editData[k] === this.defaultEditData[k])
        if (this.editData[k] !== this.defaultEditData[k]) {
          d[k] = this.editData[k]
        }
      })

      this.$emit('edit', d)
      this.editData = this.defaultEditData
    },

    toggleOption (opt) {
      if (opt === 'message') {
        this.editData.includeMessage = !this.editData.includeMessage
      } else if (opt === 'replies') {
        this.editData.replies = !this.editData.replies
      } else if (opt === 'desc') {
        this.editData.excludeRSSDesc = !this.editData.excludeRSSDesc
      }
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
          newURL: this.editData.newURL,
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
