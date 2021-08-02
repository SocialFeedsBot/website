<template>
  <div class="center">
    <div class="pb-3 pt-4 mt-4 mb-5">
      <b-container v-if="user && user.isAdmin > 0" id="adminbox" class="bv-example-row pt-4">
        <div class="d-block mb-4">
          <h3>Admin Panel</h3><br>
          <b-button class="cbtn cbtn-blurple" @click="restart({ name: 'gateway' })">
            Restart gateway
          </b-button>
          <b-button class="cbtn cbtn-dark" @click="restart({ name: 'all' })">
            Restart all connections
          </b-button>
        </div>

        <b-row v-for="(a) in services" :key="a.type + '-' + a.id" class="pb-2">
          <b-col>
            <h5 style="align-items: left;">
              {{ a.type }}-{{ a.id }}
            </h5>
          </b-col>
          <b-col>
            <b-button class="cbtn cbtn-blurple" @click="restart({ name: a.type, id: a.id })">
              Restart
            </b-button>
            <b-button class="cbtn cbtn-dark" @click="restart({ name: a.type, id: 'all' })">
              Restart all of Type
            </b-button>
          </b-col>
        </b-row>
      </b-container>
    </div>

    <div class="pb-3 pt-4 mt-4 mb-1">
      <b-container id="adminbox" class="bv-example-row pt-4">
        <div class="d-block mb-4">
          <h3>Toggle commands</h3><br>
          <b-input-group>
            <template>
              <b-form-input id="url" v-model="commandToggle.name" placeholder="Command name" /><br>
              <b-form-input id="url" v-model="commandToggle.reason" placeholder="Reason for disabling" /><br>

              <b-button class="cbtn cbtn-blurple" @click="toggleCommand(false)">
                Enable
              </b-button>

              <b-button class="cbtn cbtn-blurple" @click="toggleCommand(true)">
                Disable
              </b-button>
            </template>
          </b-input-group>
        </div>
      </b-container>
    </div>

    <div class="pb-3 pt-4 mt-2 mb-5">
      <b-container id="adminbox" class="bv-example-row pt-4">
        <div class="d-block">
          <h4>Manage Feeds {{ searchResults.length > 0 ? `(listing ${searchResults.length} feeds)` : '' }}</h4><br>
          <b-input-group>
            <template>
              <b-dropdown v-model="searchData.type" :text="searchData.type ? searchData.type : 'Type'">
                <b-dropdown-item-button @click="searchData.type = 'Reddit'">
                  <fa :icon="['fab', 'reddit']" /> Reddit
                </b-dropdown-item-button>
                <b-dropdown-item-button @click="searchData.type = 'RSS'">
                  <fa icon="rss" /> RSS
                </b-dropdown-item-button>
                <b-dropdown-item-button @click="searchData.type = 'Twitter'">
                  <fa :icon="['fab', 'twitter']" /> Twitter
                </b-dropdown-item-button>
                <b-dropdown-item-button @click="searchData.type = 'Twitch'">
                  <fa :icon="['fab', 'twitch']" /> Twitch
                </b-dropdown-item-button>
                <b-dropdown-item-button @click="searchData.type = 'YouTube'">
                  <fa :icon="['fab', 'youtube']" /> YouTube
                </b-dropdown-item-button>
                <b-dropdown-item-button @click="searchData.type = 'StatusPage'">
                  <fa :icon="['fas', 'exclamation-circle']" /> Status Page
                </b-dropdown-item-button>
                <b-dropdown-item-button @click="searchData.type = 'None'">
                  None
                </b-dropdown-item-button>
              </b-dropdown>

              <b-form-input id="url" v-model="searchData.url" placeholder="Channel/account name or feed URL" /><br>
              <b-form-input id="guildID" v-model="searchData.guildID" placeholder="Guild ID" />

              <b-button class="cbtn cbtn-blurple" @click="getFeeds()">
                Search
              </b-button>
            </template>
          </b-input-group><br>

          <b-row v-if="searchResults.length > 0">
            <b-col>Type</b-col>
            <b-col>URL</b-col>
            <b-col>Guild</b-col>
            <b-col>Actions</b-col>
          </b-row>
          <b-row v-for="feed in searchResults" :key="feed">
            <b-col>{{ feed.type }}</b-col>
            <b-col>{{ feed.url }}</b-col>
            <b-col>{{ feed.guildID }}</b-col>
            <b-col>
              <b-button class="btn-red" @click="deleteFeed(feed)">
                Delete
              </b-button>
            </b-col>
          </b-row>
        </div>
      </b-container>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      services: [],
      auth: false,
      searchData: { type: '', url: '', guildID: '' },
      searchResults: [],
      commandToggle: {
        name: '',
        disabled: false,
        reason: ''
      }
    }
  },

  computed: {
    user () {
      return this.$store.getters['user/user']
    }
  },

  beforeDestroy () {
    clearInterval(this.interval)
  },

  async mounted () {
    await this.updateStatus()
    this.interval = setInterval(() => this.updateStatus(), 10 * 1000)
  },

  methods: {
    async getFeeds () {
      this.searchResults = []

      let guildID = null
      const query = {}
      if (this.searchData.type !== '') {
        query.type = this.searchData.type.toLowerCase()
      }
      if (this.searchData.type === 'None') {
        query.type = ''
      }
      if (this.searchData.url !== '') {
        query.url = this.searchData.url
      }
      if (this.searchData.guildID !== '') {
        guildID = this.searchData.guildID
      }
      const feedInfo = (await this.$axios.get(`/feeds${guildID ? `/${guildID}` : ''}`, { params: query })).data

      this.searchResults.push(...feedInfo.feeds)
      for (let i = 1; i < feedInfo.pages; i++) {
        const data = (await this.$axios.get(`/feeds/${guildID ? `/${guildID}` : ''}`, {
          params: {
            page: i + 1,
            ...query
          }
        })).data
        this.searchResults.push(...data.feeds)
      }
    },

    async deleteFeed (feed) {
      try {
        await this.$axios.delete('/feeds', {
          data: {
            url: feed.url,
            type: feed.type,
            webhookID: feed.webhook.id,
            guildID: feed.guildID
          }
        })
        this.$bvToast.toast('Feed removed successfully!', {
          title: 'Success',
          autoHideDelay: 6000,
          appendToast: false,
          variant: 'success'
        })
        await this.getFeeds()
      } catch (e) {
        this.$bvToast.toast(e.message, {
          title: 'Error removing feed',
          autoHideDelay: 6000,
          appendToast: false,
          variant: 'danger'
        })
      }
    },

    async updateStatus () {
      try {
        const { data } = await this.$axios.get('/status/services')
        this.services = data.services
      } catch (e) {
        this.services = []
      }
    },

    async restart (target) {
      try {
        await this.$axios.post('/gateway/restart', target)
        this.$bvToast.toast('Please wait', {
          title: 'Service restarting',
          autoHideDelay: 6000,
          appendToast: false,
          variant: 'success'
        })
        this.updateStatus()
      } catch (e) {
        this.$bvToast.toast(e.message, {
          title: 'Error restarting service',
          autoHideDelay: 6000,
          appendToast: false,
          variant: 'danger'
        })
      }
    },

    async toggleCommand (disabled) {
      await this.$axios.post('/commands/toggle', {
        name: this.commandToggle.name,
        disabled,
        reason: this.commandToggle.reason
      })
    }

  }
}
</script>

<style>
.center {
  width: 100%;
  text-align: center;
}

#adminbox {
  background-color: rgb(23, 24, 27) !important;
  border-radius: 5px;
}

#guildID, #url {
  background-color: #23272A;
  border-color: #1b1b1b;
  border-radius: 1px;
  color: #ffffff
}
</style>
