<template>
  <div>
    <b-button class="cbtn cbtn-green" v-b-modal.add-feed-modal>
      Add new feed
    </b-button>

    <b-modal
      id="add-feed-modal"
      centered
      title="Add a new feed"
      header-class="modal-head"
      body-class="modal-cont"
      footer-class="modal-foot"
      modal-class="modal"
      hide-header-close="true"
    >
      <p3>Select the type of feed to add:</p3><br>
      <b-dropdown v-model="addData.type" :text="addData.type ? addData.type : 'Feed type'" class="full-length">
        <b-dropdown-item-button @click="addData.type = 'Reddit'">
          <fa :icon="['fab', 'reddit']" /> Reddit
        </b-dropdown-item-button>
        <b-dropdown-item-button @click="addData.type = 'RSS'">
          <fa icon="rss" /> RSS
        </b-dropdown-item-button>
        <b-dropdown-item-button @click="addData.type = 'Twitter'">
          <fa :icon="['fab', 'twitter']" /> Twitter
        </b-dropdown-item-button>
        <b-dropdown-item-button @click="addData.type = 'Twitch'">
          <fa :icon="['fab', 'twitch']" /> Twitch
        </b-dropdown-item-button>
        <b-dropdown-item-button @click="addData.type = 'YouTube'">
          <fa :icon="['fab', 'youtube']" /> YouTube
        </b-dropdown-item-button>
        <b-dropdown-item-button @click="addData.type = 'StatusPage'">
          <fa :icon="['fas', 'exclamation-circle']" /> Status Page
        </b-dropdown-item-button>
      </b-dropdown>

      <br><br>
      <p3>URL</p3>
      <b-form-input id="url" v-model="addData.url" autocomplete="off" placeholder="Channel/account name or feed URL" />

      <br>
      <p3>Channel</p3>
      <b-dropdown v-model="addData.channel" :text="addData.channel ? `#${channels[addData.channel].name}` : 'Channel'" class="full-length">
        <b-dropdown-item v-for="channel in Object.values(channels).filter(c => c.type === 0)" :key="channel.id" @click="addData.channel = channel.id">
          #{{ channel.name }}
        </b-dropdown-item>
      </b-dropdown>

      <br><br>
      <p3>Feed options</p3>
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
        <p3>Custom message</p3>
        <b-form-input id="url" v-model="addData.message" autocomplete="off" placeholder="Custom message" />
      </div>

      <template #modal-footer>
        <b-button class="cbtn cbtn-green" @click="add()">
          Add feed
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
    channels: { default: {} }
  },

  data: () => ({
    channel: '',
    addData: { replies: false, excludeRSSDesc: false, includeMessage: false, type: '', channel: '', url: '', message: '' },
    defaultAddData: { replies: false, excludeRSSDesc: false, includeMessage: false, type: '', channel: '', url: '', message: '' }
  }),

  methods: {
    // MODAL
    close () {
      this.$bvModal.hide('add-feed-modal')
      this.addData = JSON.parse(JSON.stringify(this.defaultAddData))
    },
    add () {
      this.$emit('addFeed', this.addData)
      this.close()
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
    }
  }

}
</script>

<style >
  .modal-head {
    background-color: rgb(23, 24, 27);
    border: 0;
    border-top-left-radius: 1px;
    border-top-right-radius: 1px;
  }
  .modal-foot {
    background-color: rgb(23, 24, 27);
    border: 0;
    border-bottom-left-radius: 1px;
    border-bottom-right-radius: 1px;
  }
  .modal-cont {
    background-color: rgb(23, 24, 27);
    border: 0;
  }
  .modal {
    border: 0;
  }
</style>
