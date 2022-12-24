<template>
  <div>
    <Navbar />
    <div class="row">
      <GuildSidebar />
      <div class="mb-5 pb-3 w-75 mt-3">
        <Nuxt />
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import GuildSidebar from '../components/GuildSidebar.vue'

export default {

  components: { Navbar, Footer, GuildSidebar }

}
</script>
