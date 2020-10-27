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

        <img v-if="guilds && !guilds.length" src="@/assets/loading.svg" width="100px" height="100px" alt="loading">

        <div
          v-for="(guild, index) in guilds"
          v-else
          :key="index"
          class="d-inline-block mx-2 transition"
          style="cursor:pointer"
          @click="manage(guild)"
        >
          <div v-b-tooltip.hover :title="guild.name" class="d-inline-block p-2">
            <img class="guild-icon rounded-circle ml-auto" :src="getGuildIcon(guild)" height="100" width="100">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

  computed: {
    guilds () {
      return this.$store.getters['user/manageableGuilds']
    }
  },

  async mounted () {
    await this.$store.dispatch('user/GET_USER_GUILDS')
  },

  methods: {
    getGuildIcon (guild) {
      if (guild.icon) { return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` } else { return '/static/blank-server.png' }
    },

    manage (guild) {
      this.$router.push({ name: 'dashboard-guild_id', params: { guild_id: guild.id } })
    }

  }

}
</script>

<style>
.guild-icon {
  background-color: #2e3338
}
</style>
