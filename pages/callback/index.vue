<template>
  <div />
</template>

<script>
export default {
  async mounted () {
    const code = this.$route.query.code
    let token
    try {
      token = await this.$axios.$post(`/oauth/callback?code=${code}`)
    } catch (e) {
      // dont do anything :D
    }

    if (token) {
      localStorage.setItem('token', token)
      const user = await this.$axios.$get('/users/@me')
      this.$store.commit('user/SET_USER', { token, ...user })

      this.$router.push({ name: 'dashboard' })
    }
  }
}
</script>
