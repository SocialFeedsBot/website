<template>
  <div>
    <div v-if="!guild.id && !channels">
      <div style="text-align: center;">
        <img src="@/assets/loading.svg" width="100px" height="100px" alt="loading">
      </div>
    </div>

    <div v-else>
      <b-container class="mt-4 mb-5 pb-3 pt-3 guild-info">
        <div class="row">
          <div class="col-2 pr-1 text-right">
            <div class="d-inline-block">
              <img :src="'https://cdn.discordapp.com/icons/' + guild.id + '/' + guild.icon + '.png'" class="rounded-circle" height="150" width="150" alt="guild icon">
            </div>
          </div>

          <div class="col-5 mt-4 text-left">
            <div class="h3 d-inline-block">
              {{ guild.name }}
            </div>
            <div class="p">
              Total feeds: {{ feedCount }}
            </div>
          </div>
        </div>
      </b-container>

      <!-- adding new feeds -->
      <b-container class="mt-4 mb-5 pb-3 pt-3 guild-info">
        <div class="row">
          <div class="col-12 mt-4 text-left">
            <div class="h3 d-inline-block">
              Add a new feed
            </div>
            <div class="p">
              Here you can add feeds right from the dashboard to be posted. You only need to type the username, however a whole link is accepted. For example, you could use <strong>memes</strong> for reddit instead of <strong>/r/memes</strong>.
            </div>
          </div>

          <div class="col-12 mt-4 mb-3">
            <div>
              <b-input-group>
                <b-form-input v-model="addData.url" />

                <template>
                  <b-dropdown v-model="addData.type" :text="addData.type ? addData.type : 'Type'">
                    <b-dropdown-item-button @click="addData.type = 'Reddit'">
                      Reddit
                    </b-dropdown-item-button>
                    <b-dropdown-item-button @click="addData.type = 'RSS'">
                      RSS
                    </b-dropdown-item-button>
                    <b-dropdown-item-button @click="addData.type = 'Twitter'">
                      Twitter
                    </b-dropdown-item-button>
                    <b-dropdown-item-button @click="addData.type = 'YouTube'">
                      YouTube
                    </b-dropdown-item-button>
                  </b-dropdown>
                  <b-dropdown v-model="addData.channel" :text="addData.channel ? `#${channels[addData.channel].name}` : 'Channel'">
                    <b-dropdown-item v-for="channel in Object.values(channels).filter(c => c.type === 0)" :key="channel.id" @click="addData.channel = channel.id">
                      #{{ channel.name }}
                    </b-dropdown-item>
                  </b-dropdown>

                  <b-button class="discord-button-blue" @click="addFeed()">
                    Add feed
                  </b-button>
                </template>
              </b-input-group>
            </div>
          </div>
        </div>
      </b-container>

      <!-- feeds -->
      <b-container class="mb-3">
        <div v-if="feeds.length === 0" style="text-align: center;">
          <h2>No feeds setup in this server</h2>
          <p>Add one using the df!add command or press 'Add' in the top corner.</p>
        </div>
        <div v-for="(feeds, channelID) in feeds" v-else :key="channelID">
          <br><h4 class="channel-header">
            #{{ channels[channelID].name.toUpperCase() }} ({{ feeds.length }})
          </h4><br>
          <b-row>
            <FeedBlock v-for="(feed, i) in feeds" :key="channelID + '-' + i" :data="feed" @remove="remove(feed)" />
          </b-row>
        </div>
      </b-container>
    </div>
  </div>
</template>

<script>
import FeedBlock from '@/components/FeedBlock.vue'

export default {

  components: { FeedBlock },

  data () {
    return {
      guild: {},
      feeds: [],
      channels: null,
      addData: { type: '', channel: '', url: '' }
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

      for (let i = 0; i < feedInfo.pages; i++) {
        const data = (await this.$axios.get(`/feeds/${this.$route.params.guild_id}?page=${i + 1}`)).data
        feeds.push(...data.feeds)
      }

      this.channels = channels
      this.guild = guild

      const groups = {}
      feeds.forEach((doc) => {
        if (channels[doc.channelID]) {
          if (!groups[doc.channelID]) { groups[doc.channelID] = [] }
          groups[doc.channelID].push({ ...doc, channelName: channels[doc.channelID].name })
        }
      })
      this.feeds = groups
      this.feedCount = feeds.length
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
        this.$bvToast.toast(`Feed removed successfully!`, {
          title: 'Success',
          autoHideDelay: 6000,
          appendToast: false,
          variant: 'success'
        })
        await this.update()
      } catch (e) {
        this.$bvToast.toast('Try again later.', {
          title: 'Error removing feed',
          autoHideDelay: 6000,
          appendToast: false,
          variant: 'danger'
        })
      }
    },

    async addFeed () {
      try {
        await this.$axios.post('/feeds', {
          guildID: this.$route.params.guild_id,
          url: this.addData.url,
          type: this.addData.type.toLowerCase(),
          channelID: this.addData.channel,
          nsfw: this.channels[this.addData.channel].nsfw,
          options: { replies: false }
        })
        this.$bvToast.toast(`Created new feed!`, {
          title: 'Success',
          autoHideDelay: 6000,
          appendToast: false,
          variant: 'success'
        })
        await this.update()
      } catch (e) {
        console.log(e)
        this.$bvToast.toast(`Try again later, error message: ${e.response.body.message}`, {
          title: 'Unable to add feed at this time.',
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
  background: rgba(32,34,37,0.5);
  border-radius: 10px;
  border-width: 5px;
}

.discord-button-blue {
  background: #7289DA;
  color: #fff;
  border-radius: 3px;
  border: none;
  padding: 2px 16px;
  box-sizing: border-box;
}
.discord-button-blue:hover {
  background: #5c73bd;
  color: #fff;
  box-sizing: border-box;
}

.button-transparent {
  border: transparent;
  color: #fff;
  border-radius: 3px;
  border: none;
  padding: 2px 16px;
  box-sizing: border-box;
}
.button-transparent:hover {
  border: transparent;
  color: #d1d1d1;
}
.button-transparent, .button-transparent:hover {
  background: transparent
}
</style>
