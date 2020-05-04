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
  }
}
</script>

<style>
html, body {
  height: 100%;
  color: white;
  background-color: #292d32;
}

#app {
  position: relative;
}

#content {
  height: 100%;
  min-height: 100vh;
  padding-bottom: 6rem;
}
</style>
