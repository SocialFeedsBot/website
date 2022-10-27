<template>
  <main class="home">
    <div class="tiers">
      <h1>Select a tier that suits you<span class="fullstop">.</span></h1>
      <p>
        We aim to charge little but enough to keep us posting to your servers. Select one that best matches your servers
        needs.<br>
        To upgrade, select a server from your profile, head to premium and select the tier you'd like to upgrade to.
      </p>

      <div class="tierGrid">
        <Tier type="0" />
        <Tier type="0+" />
        <Tier type="1" />
        <Tier type="2" />
        <Tier type="3" />
        <Tier type="4" />
      </div>
    </div>
  </main>
</template>

<script>
import Tier from '@/components/premium/Tier.vue'

export default {
  components: { Tier },

  data: () => ({
    interval: false
  }),

  computed: {
    user () {
      return this.$store.getters['user/user']
    }
  }

}
</script>

<style lang="scss" scoped>
@import "@/assets/css/_variables.scss";

.home {
  margin-top: 5rem;
  // &>*:nth-child(2n) {
  //   background-color: $background-light;
  // }
}

.lander {
  height: 30vh;
  display: flex;
  flex-direction: row;
  align-items: center;

  .content {
    padding: 10rem 0;

    h1 {
      font-family: $font-family-brand;
      font-weight: 600;
    }

    p {
      font-weight: 400;
    }
  }
}

.tiers {

  .tierGrid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(510px, 1fr));
    grid-gap: 1rem;
    margin-top: 4rem;
  }

  h1 {
    font-family: $font-family-brand;
    font-weight: 600;

    .fullstop {
      color: $blurple;
    }
  }
}

@media screen and (max-width: 1200px) {
  .lander {
    text-align: center;

    .content {
      padding: 2rem;
      margin: 0 auto;
    }
  }

  .tiers .tierlist {
    grid-template-columns: auto;
  }
}
</style>
