<template>
  <div>
    <div class="container mb-5 pb-3">
      <div style="text-align: center;">
        <h3 class="mt-4 pt-4">
          Please select a server
        </h3>
        <p class="d-block mb-4">
          If your server does not show up here, ensure you have the 'Manage Server' permission and you have invited the bot.
        </p>
        <br>

        <div v-if="ready && guilds.length === 0">
          <h4>No servers found.</h4>
          <p>Please ensure you have the <code>Manage Server</code> permission and the bot is invited in your server.</p>
        </div>

        <div v-if="ready == false">
          <div v-for="(index) in [1,2,3,4,5]" :key="index" class="d-inline-block p-2">
            <div class="guild-icon blankGuild skeleton" />
          </div>
        </div>
        <div v-if="ready && guilds.length > 0">
          <div
            v-for="(guild, index) in guilds"
            :key="index"
            class="d-inline-block mx-2 transition"
            style="cursor:pointer"
            @click="manage(guild)"
          >
            <div>
              <div v-b-tooltip.hover :title="guild.name" class="d-inline-block p-2">
                <img v-if="guild.icon" class="guild-icon rounded-circle ml-auto" :src="getGuildIcon(guild)" height="100" width="100">
                <div v-else class="guild-icon blankGuild">
                  <div class="blankGuildName">
                    {{ acronym(guild.name) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

  data: () => ({
    ready: false
  }),

  computed: {
    guilds () {
      return this.$store.getters['user/manageableGuilds']
    }
  },

  async mounted () {
    this.ready = false
    await this.$store.dispatch('user/GET_USER_GUILDS')
    this.ready = true
  },

  methods: {
    getGuildIcon (guild) {
      if (guild && guild.icon) { return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` } else { return '/static/blank-server.png' }
    },

    manage (guild) {
      this.$router.push({ name: 'dashboard-guild_id', params: { guild_id: guild.id } })
    },

    acronym (name) {
      return name.split(/\s/).reduce((accumulator, word) => {
        return accumulator + word.charAt(0)
      }, '')
    }

  }

}
</script>

<style>
.guild-icon {
  background-color: #2e3338
}
.guild-icon:hover {
  box-shadow: 0 0 5px 2px #000;
  border: 0px;
}
.blankGuild {
  background-color: #2e3338;
  width: 100px;
  height: 100px;
  border-radius: 50% !important;
}
.blankGuildName {
  font-weight: 400;
  font-size: 20px;
  width: 100%;
  line-height: 96px;
}
</style>
