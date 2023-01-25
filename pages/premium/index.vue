<template>
  <main class="home">
    <div class="tiers">
      <h1>Select a tier that suits you<span class="fullstop">.</span></h1>
      <p>
        We aim to charge little but enough to keep us posting to your servers. Select one that best matches your servers
        needs.<br>
        To upgrade, select a server from your profile, head to premium and select the tier you'd like to upgrade to.
      </p>
      <a href="https://billing.stripe.com/p/login/6oEg0H90y4ZzbVC9AA">
        <Button>
          Manage your premium
        </button>
      </a>

      <div class="tierGrid">
        <Tier type="0" />
        <Tier type="1" @select="select" />
        <Tier type="2" @select="select" />
        <Tier type="3" @select="select" />
        <Tier type="4" @select="select" />
      </div>
    </div>

    <UpgradeModal @select="goCheckout" />
  </main>
</template>

<script>
import Button from '@/components/Button.vue'
import Tier from '@/components/premium/Tier.vue'
import UpgradeModal from '@/components/UpgradeModal.vue'

export default {
  components: { Button, Tier, UpgradeModal },

  data: () => ({
    interval: false,
    selected: 0
  }),

  computed: {
    user () {
      return this.$store.getters['user/user']
    }
  },

  methods: {
    select (t, a) { this.selected = { tier: t, period: a } },

    async goCheckout (guild) {
      const res = await this.$axios.post('/premium/checkout', {
        userID: this.user.id,
        guildID: guild,
        tier: this.selected.tier,
        period: this.selected.period
      })
      window.location = res.data.url
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
