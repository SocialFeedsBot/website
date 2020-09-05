<template>
  <div />
</template>

<script>
export default {

  mounted () {
    localStorage.removeItem('token')
    this.$store.dispatch('user/SET_USER', null)
    window.location = '/'
  }

}
</script>
