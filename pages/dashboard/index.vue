<template>
  <div v-if="ready">
    <div style="text-align: center;">
      <div v-if="ready && guildID === ''">
        <h3 class="mt-4 pt-4">
          Select a server from the side panel.
        </h3>
        <p class="d-block mb-4">
          If your server does not show up there, ensure you have the 'Manage Server' permission and you have invited the bot.
        </p>
      </div>
      <div v-else-if="ready && guildID !== ''">
        <h3 class="mt-4 pt-4">
          {{ currentGuild.name }}
        </h3>
      </div>
    </div>
  </div>
  <div v-else class="container mb-5 pb-3 w-75">
    <div style="text-align: center;" class="mt-4">
      <img src="@/assets/loading.gif" height="100" width="100">
    </div>
  </div>
</template>

<script>
export default {

  layout: 'dashboard',

  data: () => ({
    ready: false,
    guildID: ''
  }),

  computed: {
    user () {
      return this.$store.getters['user/user']
    },

    guilds () {
      return this.$store.getters['user/manageableGuilds']
    },

    guildFeeds () {
      return this.$store.getters['feeds/feeds']
    },

    guildFeedCount () {
      return this.$store.getters['feeds/count']
    },

    currentGuild () {
      return this.$store.getters['guild/guild']
    },

    currentGuildID () {
      return this.$store.getters['guild/currentGuild']
    },

    guildChannels () {
      return this.$store.getters['guild/channels']
    }
  },

  async mounted () {
    await this.refresh()
  },

  methods: {
    async refresh () {
      this.ready = false

      await this.$store.dispatch('user/GET_USER_GUILDS')
      if (this.guildID !== '') {
        await this.$store.dispatch('guild/GET_GUILD', this.guildID)
        await this.$store.dispatch('feeds/GET_FEEDS', this.guildID)
      }

      if (!this.user) {
        this.$router.push({ name: 'oauth' })
        return
      }

      this.ready = true
    },

    getGuildIcon (guild) {
      if (guild && guild.icon) { return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` } else { return '/static/blank-server.png' }
    },

    async switchServer (guild) {
      this.ready = false
      this.guildID = guild.id

      // reset current state
      await this.$store.dispatch('guild/RESET')
      await this.$store.dispatch('feeds/RESET')

      // get new data
      await this.refresh()
    },

    acronym (name) {
      return name.split(/\s/).reduce((accumulator, word) => {
        return accumulator + word.charAt(0)
      }, '')
    }

  }

}
</script>

<style lang="scss" scoped>
@import "@/assets/css/_variables.scss";

.guild-icon {
  background-color: #2e3338
}
.guild-icon:hover {
  box-shadow: 0 0 10px 2px #1b1d1f;
  border: 0px;
  animation: 0.5s ease infinite expand;
}
.blankGuild {
  background-color: #2e3338;
  width: 35px;
  height: 35px;
  border-radius: 25% !important;
}
.blankGuildName {
  font-size: 20px;
  text-align: center;
  color: #707070
}

</style>
