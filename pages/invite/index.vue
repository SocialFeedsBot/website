<template>
  <div />
</template>

<script>
import config from '../../public_config.json'

export default {
  mounted () {
    window.location = `https://discord.com/api/oauth2/authorize?client_id=${config.clientID}&permissions=0&scope=bot%20applications.commands`
  }
}
</script>
