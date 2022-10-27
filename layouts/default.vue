<template>
  <div id="app">
    <Navbar />
    <nuxt />
    <Footer />
  </div>
</template>

<script>

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default {
  components: {
    Navbar,
    Footer
  },

  transition: 'default'
}
</script>

<style>
html,
body {
  color: white;
  background-color: #2E2E40;
  font-family: 'Work Sans', sans-serif;
  font-weight: 400;
  padding: 0;
  margin: 0;
}

main {
  min-height: 80vh;
  max-width: 1250px;
  margin: 0 1rem;
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
