<template>
  <div v-if="ready" class="guild-list">
    <div
      v-for="(guild, index) in guilds"
      :key="index"
      style="cursor:pointer"
      @click="switchServer(guild)"
    >
      <div>
        <div class="p-2">
          <img v-if="guild.icon" class="guild-icon rounded-circle ml-auto" :src="getGuildIcon(guild)" height="35" width="35">
          <div v-else class="guild-icon blankGuild">
            <div class="blankGuildName">
              {{ acronym(guild.name) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="guild-list">
    <div class="p-2">
      <img src="@/assets/loading.gif" class="guild-icon rounded-circle ml-auto" height="35" width="35">
    </div>
  </div>
</template>

<script>
export default {

  data: () => ({ ready: false }),

  computed: {
    guilds () {
      return this.$store.getters['user/manageableGuilds']
    }
  },

  async mounted () {
    await this.$store.dispatch('user/GET_USER_GUILDS')
    this.ready = true
  },

  methods: {
    getGuildIcon (guild) {
      if (guild && guild.icon) { return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` } else { return '/static/blank-server.png' }
    },

    acronym (name) {
      return name.split(/\s/).reduce((accumulator, word) => {
        return accumulator + word.charAt(0)
      }, '')
    },

    async switchServer (guild) {
      await this.$store.dispatch('guild/RESET')
      await this.$store.dispatch('feeds/RESET')
      this.$router.push({ name: 'dashboard-guild_id', params: { guild_id: guild.id } })
    }
  }

}
</script>

<style lang="scss" scoped>
@import "@/assets/css/_variables.scss";

.guild-list {
  width: 60px;
  background-color: $background-light;
  height: calc(100vh - 56px);
  overflow-x: hidden;
  overflow-y: auto;
}

.guild-icon {
  background-color: #2e3338
}
.guild-icon:hover {
  box-shadow: 0 0 5px 2px #1b1d1f;
  border: 0px;
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
