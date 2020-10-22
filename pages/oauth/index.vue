<template>
  <div />
</template>

<script>
import config from '../../public_config.json'

export default {
  mounted () {
    window.location = `https://discord.com/api/oauth2/authorize?client_id=${config.clientID}&redirect_uri=${encodeURIComponent(`${config.siteURL}/callback`)}&response_type=code&scope=guilds%20identify`
  }
}
</script>
