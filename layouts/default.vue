<template>
  <div id="app">
    <Navbar />
    <nuxt />
  </div>
</template>

<script>
import Navbar from '../components/Navbar'
export default {
  components: {
    Navbar
  },

  transition: 'default'
}
</script>

<style>
html, body {
  height: 100%;
  color: white;
  background-color: #36393f;
}

#app {
  position: relative;
}

#content {
  height: 100%;
  min-height: 100vh;
  padding-bottom: 6rem;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.1s;
}
.page-enter,
.page-leave-to {
  opacity: 0;
}

</style>
