<template>
  <div />
</template>

<script>
export default {
  async mounted () {
    const code = this.$route.query.code
    let token
    try {
      token = await this.$axios.$post(`/oauth/callback/${code}`)
    } catch (e) {
      // dont do anything :D
    }

    if (token) {
      localStorage.setItem('token', token)
      this.$ws.connect()
      const user = await this.$axios.$get('/users/@me')
      this.$store.commit('user/SET_USER', { token, ...user })
    }

    window.location = '/'
  }
}
</script>
