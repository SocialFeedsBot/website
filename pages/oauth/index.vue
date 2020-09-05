<template>
  <div />
</template>

<script>
export default {
  mounted () {
    window.location = 'https://discord.com/api/oauth2/authorize?client_id=640989075452723200&redirect_uri=https%3A%2F%2Fdiscordfeeds.com%2Fcallback&response_type=code&scope=guilds%20identify'
  }
}
</script>
