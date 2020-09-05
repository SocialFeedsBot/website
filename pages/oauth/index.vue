<template>
  <div />
</template>

<script>
export default {
  mounted () {
    window.location = 'https://discord.com/api/oauth2/authorize?client_id=682258887440597022&prompt=none&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&response_type=code&scope=identify%20guilds'
  }
}
</script>
